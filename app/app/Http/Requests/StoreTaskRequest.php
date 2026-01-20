<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:1', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
            'status' => ['nullable', 'in:TODO,IN_PROGRESS,BLOCKED,DONE'],
            'priority' => ['nullable', 'in:LOW,MEDIUM,HIGH,URGENT'],
            'due_date' => ['nullable', 'date'],
            'is_today' => ['nullable', 'boolean'],
            'estimated_minutes' => ['nullable', 'integer', 'min:1', 'max:1440'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est requis.',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',
            'project_id.exists' => 'Le projet sélectionné n\'existe pas.',
            'due_date.date' => 'La date d\'échéance n\'est pas valide.',
        ];
    }
}
