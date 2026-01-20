<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:1', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'category' => ['nullable', 'in:PROJECT,AREA,RESOURCE,ARCHIVE'],
            'status' => ['nullable', 'in:ACTIVE,PAUSED,ARCHIVED'],
            'color' => ['nullable', 'string', 'max:7'],
            'icon' => ['nullable', 'string', 'max:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom du projet est requis.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
        ];
    }
}
