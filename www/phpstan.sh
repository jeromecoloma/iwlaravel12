#!/bin/bash

# PHPStan static analysis script with proper memory limit
vendor/bin/phpstan analyse --memory-limit=512M "$@"