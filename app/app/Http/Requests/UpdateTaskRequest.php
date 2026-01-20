<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->id === $this->route('task')->user_id;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'min:1', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
            'status' => ['sometimes', 'in:TODO,IN_PROGRESS,BLOCKED,DONE'],
            'priority' => ['sometimes', 'in:LOW,MEDIUM,HIGH,URGENT'],
            'due_date' => ['nullable', 'date'],
            'is_today' => ['nullable', 'boolean'],
            'completed' => ['nullable', 'boolean'],
            'estimated_minutes' => ['nullable', 'integer', 'min:1', 'max:1440'],
        ];
    }
}
