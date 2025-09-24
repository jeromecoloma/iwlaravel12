<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $emailRule = app()->environment('testing')
            ? ['required', 'email:rfc', 'max:255', 'not_regex:/\+.*@/']
            : ['required', 'email:rfc,dns', 'max:255', 'not_regex:/\+.*@/'];

        return [
            'name' => ['required', 'string', 'min:2', 'max:255', 'regex:/^[a-zA-Z\s\.\-\']+$/'],
            'email' => $emailRule,
            'subject' => ['required', 'string', 'min:5', 'max:255', 'not_regex:/^(test|spam|advertisement)$/i'],
            'message' => ['required', 'string', 'min:10', 'max:5000', 'not_regex:/\b(viagra|casino|lottery)\b/i'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please provide your name.',
            'name.min' => 'Name must be at least 2 characters long.',
            'name.max' => 'Name cannot exceed 255 characters.',
            'name.regex' => 'Name can only contain letters, spaces, dots, hyphens, and apostrophes.',

            'email.required' => 'Please provide your email address.',
            'email.email' => 'Please provide a valid email address (e.g., name@example.com).',
            'email.max' => 'Email address cannot exceed 255 characters.',
            'email.not_regex' => 'Please use a standard email format without plus signs.',

            'subject.required' => 'Please provide a subject for your message.',
            'subject.min' => 'Subject must be at least 5 characters long.',
            'subject.max' => 'Subject cannot exceed 255 characters.',
            'subject.not_regex' => 'Please provide a more descriptive subject.',

            'message.required' => 'Please provide a message.',
            'message.min' => 'Message must be at least 10 characters long to ensure we understand your inquiry.',
            'message.max' => 'Message cannot exceed 5000 characters. Please be more concise.',
            'message.not_regex' => 'Your message contains content that appears to be spam. Please revise and try again.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'name',
            'email' => 'email address',
            'subject' => 'subject',
            'message' => 'message',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator): void
    {
        if ($this->expectsJson()) {
            throw new \Illuminate\Http\Exceptions\HttpResponseException(
                response()->json([
                    'message' => 'The given data was invalid.',
                    'errors' => $validator->errors(),
                ], 422)
            );
        }

        // For web requests, redirect back with errors
        throw new \Illuminate\Http\Exceptions\HttpResponseException(
            redirect()->back()
                ->withInput($this->except(['_token']))
                ->withErrors($validator)
        );
    }
}
