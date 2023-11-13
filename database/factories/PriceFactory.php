<?php

namespace Database\Factories;

use App\Models\Price;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class PriceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Price::class;

    public function definition(): array
    {
        return [
            'value' => random_int(0, 9999),
            'currency_code' => fake()->currencyCode(),
            'currency_symbol' => fake()->currencyCode(),
        ];
    }
}
