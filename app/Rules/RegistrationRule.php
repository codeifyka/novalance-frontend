<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class RegistrationRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if($attribute == 'account_type' && !($value == 'freelancer' or $value == 'client')){
            $fail('account_type must be either a "client" or a "freelancer".');
        }
    }
}
