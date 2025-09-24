<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class OptimizeImages extends Command
{
    protected $signature = 'images:optimize
                            {--source=public/images : Source directory for images}
                            {--sizes=320,480,768,1024,1280,1920 : Comma-separated list of widths to generate}
                            {--formats=webp,jpg : Comma-separated list of formats to generate}
                            {--quality=85 : Quality for compression (1-100)}
                            {--dry-run : Show what would be done without actually doing it}';

    protected $description = 'Generate responsive image variants for optimization';

    public function handle(): int
    {
        $sourceDir = $this->option('source');
        $sizes = array_map('intval', explode(',', (string) $this->option('sizes')));
        $formats = explode(',', (string) $this->option('formats'));
        $quality = (int) $this->option('quality');
        $dryRun = $this->option('dry-run');

        if (! File::exists((string) $sourceDir)) {
            $this->error("Source directory {$sourceDir} does not exist.");

            return self::FAILURE;
        }

        $this->info("Optimizing images in: {$sourceDir}");
        $this->info('Target sizes: '.implode(', ', $sizes));
        $this->info('Target formats: '.implode(', ', $formats));
        $this->info("Quality: {$quality}%");

        if ($dryRun) {
            $this->warn('DRY RUN MODE - No files will be modified');
        }

        $imageFiles = $this->findImageFiles($sourceDir);

        if (empty($imageFiles)) {
            $this->warn("No image files found in {$sourceDir}");

            return self::SUCCESS;
        }

        $progressBar = $this->output->createProgressBar(count($imageFiles));
        $progressBar->start();

        $generated = 0;
        $skipped = 0;

        foreach ($imageFiles as $imagePath) {
            $result = $this->processImage($imagePath, $sizes, $formats, $quality, $dryRun);
            $generated += $result['generated'];
            $skipped += $result['skipped'];
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        $this->info('Image optimization complete!');
        $this->info("Generated: {$generated} variants");
        $this->info("Skipped: {$skipped} variants (already exist)");

        return self::SUCCESS;
    }

    protected function findImageFiles(string $directory): array
    {
        $extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        $files = [];

        foreach (File::allFiles($directory) as $file) {
            $extension = strtolower($file->getExtension());
            if (in_array($extension, $extensions)) {
                // Skip already optimized files (those with -Nw suffix)
                if (! preg_match('/-\d+w\.(jpg|jpeg|png|gif|webp|svg)$/i', $file->getFilename())) {
                    $files[] = $file->getPathname();
                }
            }
        }

        return $files;
    }

    protected function processImage(string $imagePath, array $sizes, array $formats, int $quality, bool $dryRun): array
    {
        $generated = 0;
        $skipped = 0;

        $pathInfo = pathinfo($imagePath);
        $dirname = $pathInfo['dirname'] ?? '';
        $filename = $pathInfo['filename'] ?? '';
        $baseName = $dirname.'/'.$filename;

        foreach ($sizes as $size) {
            foreach ($formats as $format) {
                $outputPath = "{$baseName}-{$size}w.{$format}";

                if (File::exists($outputPath)) {
                    $skipped++;

                    continue;
                }

                if (! $dryRun) {
                    $this->generateImageVariant($imagePath, $outputPath, $size, $quality);
                }

                $generated++;
            }
        }

        return compact('generated', 'skipped');
    }

    protected function generateImageVariant(string $sourcePath, string $outputPath, int $width, int $quality): void
    {
        $pathInfo = pathinfo($sourcePath);
        $sourceExtension = strtolower($pathInfo['extension'] ?? '');
        $outputExtension = strtolower(pathinfo($outputPath, PATHINFO_EXTENSION));

        // For SVG files, we'll just copy them as-is since they're already scalable
        if ($sourceExtension === 'svg') {
            File::copy($sourcePath, $outputPath);

            return;
        }

        // Try to use GD for real image processing
        if (extension_loaded('gd')) {
            $this->processImageWithGD($sourcePath, $outputPath, $width, $quality, $outputExtension);
        } else {
            // Fallback to placeholder generation
            $this->createPlaceholderImage($outputPath, $width, $quality);
        }
    }

    protected function processImageWithGD(string $sourcePath, string $outputPath, int $width, int $quality, string $outputFormat): void
    {
        try {
            // Load source image
            $sourceImage = $this->loadImageFromFile($sourcePath);
            if (! $sourceImage) {
                throw new Exception('Failed to load source image');
            }

            // Get original dimensions
            $originalWidth = imagesx($sourceImage);
            $originalHeight = imagesy($sourceImage);

            // Calculate new height maintaining aspect ratio
            $height = (int) (($originalHeight / $originalWidth) * $width);

            // Ensure dimensions are at least 1
            $width = max(1, $width);
            $height = max(1, $height);

            // Create new image
            $resizedImage = imagecreatetruecolor($width, $height);

            // Preserve transparency for PNG and WebP
            if (in_array($outputFormat, ['png', 'webp'])) {
                imagealphablending($resizedImage, false);
                imagesavealpha($resizedImage, true);
                $transparent = imagecolorallocatealpha($resizedImage, 255, 255, 255, 127);
                if ($transparent !== false) {
                    imagefill($resizedImage, 0, 0, $transparent);
                }
            }

            // Resize image
            imagecopyresampled(
                $resizedImage,
                $sourceImage,
                0, 0, 0, 0,
                $width, $height,
                $originalWidth, $originalHeight
            );

            // Save image in requested format
            $this->saveImageToFile($resizedImage, $outputPath, $outputFormat, $quality);

            // Clean up memory
            imagedestroy($sourceImage);
            imagedestroy($resizedImage);

        } catch (Exception $e) {
            $this->warn("Failed to process image with GD: {$e->getMessage()}");
            // Fallback to placeholder
            $this->createPlaceholderImage($outputPath, $width, $quality);
        }
    }

    protected function loadImageFromFile(string $path)
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        switch ($extension) {
            case 'jpg':
            case 'jpeg':
                return imagecreatefromjpeg($path);
            case 'png':
                return imagecreatefrompng($path);
            case 'gif':
                return imagecreatefromgif($path);
            case 'webp':
                return function_exists('imagecreatefromwebp') ? imagecreatefromwebp($path) : false;
            default:
                return false;
        }
    }

    protected function saveImageToFile($image, string $path, string $format, int $quality): bool
    {
        switch ($format) {
            case 'jpg':
            case 'jpeg':
                return imagejpeg($image, $path, $quality);
            case 'png':
                // PNG quality is 0-9, convert from 0-100
                $pngQuality = (int) ((100 - $quality) / 10);

                return imagepng($image, $path, $pngQuality);
            case 'gif':
                return imagegif($image, $path);
            case 'webp':
                return function_exists('imagewebp') ? imagewebp($image, $path, $quality) : false;
            default:
                return false;
        }
    }

    protected function createPlaceholderImage(string $outputPath, int $width, int $quality): void
    {
        $height = (int) ($width * 0.6); // 3:2 aspect ratio
        $extension = strtolower(pathinfo($outputPath, PATHINFO_EXTENSION));

        if ($extension === 'svg') {
            $svg = $this->generatePlaceholderSVG($width, $height);
            File::put($outputPath, $svg);

            return;
        }

        // Create actual placeholder images using GD if available
        if (extension_loaded('gd')) {
            $this->createGDPlaceholder($outputPath, $width, $height, $quality, $extension);
        } else {
            // Fallback: create a simple info file
            $info = "<!-- Placeholder for {$width}x{$height} {$extension} image (Quality: {$quality}%) -->\n";
            $info .= "<!-- GD extension not available. Install php-gd for real image processing -->\n";
            File::put($outputPath.'.info', $info);
        }
    }

    protected function createGDPlaceholder(string $outputPath, int $width, int $height, int $quality, string $format): void
    {
        // Ensure dimensions are at least 1
        $width = max(1, $width);
        $height = max(1, $height);

        // Create a colorful placeholder image
        $image = imagecreatetruecolor($width, $height);

        // Generate colors based on dimensions for variety
        $hue = ($width + $height) % 360;
        $colors = $this->generateColorPalette($image, $hue);

        // Fill background with gradient-like effect
        $this->createGradientBackground($image, $width, $height, $colors);

        // Add dimension text
        $this->addDimensionText($image, $width, $height, $colors['text']);

        // Save the placeholder
        $this->saveImageToFile($image, $outputPath, $format, $quality);

        imagedestroy($image);
    }

    protected function generateColorPalette($image, int $hue): array
    {
        $colors = [];

        // Convert HSL to RGB for better color generation
        $colors['primary'] = imagecolorallocate($image,
            ...$this->hslToRgb($hue, 70, 50)
        );

        $colors['secondary'] = imagecolorallocate($image,
            ...$this->hslToRgb(($hue + 30) % 360, 60, 60)
        );

        $colors['text'] = imagecolorallocate($image, 255, 255, 255);
        $colors['shadow'] = imagecolorallocate($image, 0, 0, 0);

        return $colors;
    }

    protected function createGradientBackground($image, int $width, int $height, array $colors): void
    {
        // Simple diagonal gradient effect
        for ($y = 0; $y < $height; $y++) {
            for ($x = 0; $x < $width; $x++) {
                $factor = ($x + $y) / ($width + $height);

                if ($factor < 0.5) {
                    imagesetpixel($image, $x, $y, $colors['primary']);
                } else {
                    imagesetpixel($image, $x, $y, $colors['secondary']);
                }
            }
        }
    }

    protected function addDimensionText($image, int $width, int $height, $textColor): void
    {
        $text = "{$width} × {$height}";

        // Use simple imagestring function to avoid font file issues
        $fontsize = 5; // Built-in font size 1-5
        $textWidth = strlen($text) * imagefontwidth($fontsize);
        $textHeight = imagefontheight($fontsize);

        $x = ($width - $textWidth) / 2;
        $y = ($height - $textHeight) / 2;

        imagestring($image, $fontsize, (int) $x, (int) $y, $text, $textColor);
    }

    protected function getBuiltinFont(): int
    {
        // Return built-in font number (1-5)
        return 5;
    }

    protected function hslToRgb(int $h, int $s, int $l): array
    {
        $h /= 360;
        $s /= 100;
        $l /= 100;

        if ($s == 0) {
            $r = $g = $b = $l;
        } else {
            $hue2rgb = function ($p, $q, $t) {
                if ($t < 0) {
                    $t += 1;
                }
                if ($t > 1) {
                    $t -= 1;
                }
                if ($t < 1 / 6) {
                    return $p + ($q - $p) * 6 * $t;
                }
                if ($t < 1 / 2) {
                    return $q;
                }
                if ($t < 2 / 3) {
                    return $p + ($q - $p) * (2 / 3 - $t) * 6;
                }

                return $p;
            };

            $q = $l < 0.5 ? $l * (1 + $s) : $l + $s - $l * $s;
            $p = 2 * $l - $q;

            $r = $hue2rgb($p, $q, $h + 1 / 3);
            $g = $hue2rgb($p, $q, $h);
            $b = $hue2rgb($p, $q, $h - 1 / 3);
        }

        return [round($r * 255), round($g * 255), round($b * 255)];
    }

    protected function generatePlaceholderSVG(int $width, int $height): string
    {
        $colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
        $color = $colors[array_rand($colors)];

        $rectWidth = $width - 20;
        $rectHeight = $height - 20;
        $textX = $width / 2;
        $textY = $height / 2;

        return <<<SVG
<svg width="{$width}" height="{$height}" viewBox="0 0 {$width} {$height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="{$width}" height="{$height}" fill="{$color}" opacity="0.1"/>
  <rect x="10" y="10" width="{$rectWidth}" height="{$rectHeight}" fill="none" stroke="{$color}" stroke-width="2" stroke-dasharray="10,5"/>
  <text x="{$textX}" y="{$textY}" text-anchor="middle" dominant-baseline="middle" fill="{$color}" font-family="Arial, sans-serif" font-size="24" font-weight="bold">
    {$width} × {$height}
  </text>
</svg>
SVG;
    }
}
