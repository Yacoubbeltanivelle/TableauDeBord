<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:1', 'max:255'],
            'content' => ['nullable', 'string', 'max:100000'],
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
            'is_pinned' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre de la note est requis.',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',
        ];
    }
}
