<template>
  <div class="w-full min-h-screen bg-gray-50/40 flex flex-col items-center pt-24 md:pt-28 pb-20">
    <!-- Header depending on account type -->
    <ClientHeaderVue v-if="accountType === 'client'" />
    <FreeLancerHeaderVue v-else-if="accountType === 'freelancer'" target="wallet" />
    <div v-else class="w-full fixed top-0 z-50 bg-white shadow-sm h-16 md:h-20 flex items-center justify-between px-8 md:px-24">
      <router-link to="/home" class="flex items-center gap-2">
        <img src="/logo.png" class="h-8 object-contain rounded-full" alt="NovaLance logo" />
        <span class="text-black text-xl font-bold hover:text-purple">NovaLance</span>
      </router-link>
      <router-link to="/admin" class="text-sm font-semibold text-purple hover:underline">Admin Panel</router-link>
    </div>

    <div class="w-11/12 max-w-6xl flex flex-col gap-8 mt-4">
      <!-- Title & Summary Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-3xl font-extrabold text-gray-900">Wallet & Escrow</h1>
            <span class="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-purple/10 text-purple">
              {{ accountType }}
            </span>
          </div>
          <p class="text-sm text-gray-500 mt-1">
            Real-time balance, secured escrow funds, and double-entry transaction ledger.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="openDepositModal"
            class="bg-purple text-white hover:bg-[#7144d6] px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Icon icon="solar:wallet-money-linear" class="text-lg" />
            <span>Deposit Funds</span>
          </button>

          <button
            v-if="accountType === 'freelancer' || (wallet && wallet.balance > 0)"
            @click="openPayoutModal"
            class="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Icon icon="solar:card-send-linear" class="text-lg text-purple" />
            <span>Request Payout</span>
          </button>
        </div>
      </div>

      <!-- Balance Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Available Balance -->
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-purple/5 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Available Balance</span>
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Icon icon="solar:wallet-bold" class="text-lg" />
              </div>
            </div>
            <div class="text-3xl font-black text-gray-900">
              ${{ Number(wallet?.balance || 0).toFixed(2) }}
            </div>
            <p class="text-xs text-gray-400 mt-1">
              {{ accountType === 'client' ? 'Spendable on job contracts & proposals' : 'Withdrawable earnings' }}
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Status: <strong class="text-emerald-600 font-semibold">Active & Ready</strong></span>
            <button @click="openDepositModal" class="text-purple font-semibold hover:underline cursor-pointer">Top Up &rarr;</button>
          </div>
        </div>

        <!-- Escrow Locked Balance -->
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-50 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Locked in Escrow</span>
              <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Icon icon="solar:lock-keyhole-bold" class="text-lg" />
              </div>
            </div>
            <div class="text-3xl font-black text-amber-600">
              ${{ Number(wallet?.escrow_balance || 0).toFixed(2) }}
            </div>
            <p class="text-xs text-gray-400 mt-1">
              Protected in escrow for in-progress contract milestones
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Security: <strong class="text-gray-700 font-semibold">Platform Vault</strong></span>
            <router-link to="/proposals" class="text-purple font-semibold hover:underline">View Contracts &rarr;</router-link>
          </div>
        </div>

        <!-- Gateway Info Card -->
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Payment Gateway</span>
              <div class="w-8 h-8 rounded-lg bg-purple/10 text-purple flex items-center justify-center">
                <Icon icon="solar:shield-check-bold" class="text-lg" />
              </div>
            </div>
            <div class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Icon icon="logos:stripe" class="h-6 object-contain" />
              <span>{{ stripeConfigured ? 'Elements (Live)' : 'Test Simulation' }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              {{ stripeConfigured ? 'Real-time card checkout via Stripe PaymentElement.' : 'Test fallback active until STRIPE_KEY & STRIPE_SECRET are configured.' }}
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Ledger: <strong class="text-gray-700 font-semibold">Double-Entry</strong></span>
            <span class="px-2 py-0.5 bg-gray-100 rounded-full font-mono text-[10px] text-gray-600">v2.0</span>
          </div>
        </div>
      </div>

      <!-- Transaction Ledger Table Section -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Transaction History</h2>
            <p class="text-xs text-gray-500">Audit log of all credits, debits, escrow holds, and payouts.</p>
          </div>

          <!-- Filter Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              v-for="filter in ['all', 'deposit', 'escrow_lock', 'escrow_release', 'escrow_refund', 'payout']"
              :key="filter"
              @click="activeFilter = filter"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition cursor-pointer"
              :class="activeFilter === filter ? 'bg-purple text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              {{ filter.replace('_', ' ') }}
            </button>
          </div>
        </div>

        <!-- Transactions Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                <th class="py-3 px-4">TX ID</th>
                <th class="py-3 px-4">Type</th>
                <th class="py-3 px-4">Description</th>
                <th class="py-3 px-4">Date</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-if="isLoading" class="text-center">
                <td colspan="6" class="py-8 text-gray-400">Loading transactions...</td>
              </tr>
              <tr v-else-if="filteredTransactions.length === 0" class="text-center">
                <td colspan="6" class="py-12">
                  <div class="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <Icon icon="solar:bill-cross-linear" class="text-4xl text-gray-300" />
                    <p class="text-sm font-medium">No transactions found.</p>
                    <button @click="openDepositModal" class="mt-2 text-xs font-semibold text-purple hover:underline">
                      Make a first deposit to get started &rarr;
                    </button>
                  </div>
                </td>
              </tr>
              <tr
                v-for="tx in filteredTransactions"
                :key="tx.id"
                class="hover:bg-gray-50/60 transition-colors"
              >
                <!-- TX ID -->
                <td class="py-3.5 px-4 font-mono text-xs text-gray-500 font-semibold">
                  #TX-{{ String(tx.id).padStart(5, '0') }}
                </td>

                <!-- Type Badge -->
                <td class="py-3.5 px-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize inline-flex items-center gap-1.5"
                    :class="getTypeBadgeClass(tx.type)"
                  >
                    <Icon :icon="getTypeIcon(tx.type)" class="text-xs" />
                    {{ tx.type.replace('_', ' ') }}
                  </span>
                </td>

                <!-- Description -->
                <td class="py-3.5 px-4 text-gray-700 font-medium">
                  {{ tx.description || 'System transaction' }}
                </td>

                <!-- Date -->
                <td class="py-3.5 px-4 text-xs text-gray-400 whitespace-nowrap">
                  {{ formatDate(tx.created_at) }}
                </td>

                <!-- Status Badge -->
                <td class="py-3.5 px-4">
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    :class="tx.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : tx.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'"
                  >
                    {{ tx.status }}
                  </span>
                </td>

                <!-- Amount -->
                <td class="py-3.5 px-4 text-right font-bold whitespace-nowrap" :class="tx.direction === 'credit' ? 'text-emerald-600' : 'text-gray-900'">
                  {{ tx.direction === 'credit' ? '+' : '-' }}${{ Number(tx.amount).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Deposit Modal (Stripe Elements / Test Simulation) -->
    <div
      v-if="isDepositModalOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click.self="closeDepositModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 flex flex-col gap-6 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <!-- Close button -->
        <button
          @click="closeDepositModal"
          class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
          <Icon icon="material-symbols:close" class="text-xl" />
        </button>

        <!-- Header -->
        <div class="flex items-center gap-3 border-b pb-4">
          <div class="w-10 h-10 rounded-xl bg-purple/10 text-purple flex items-center justify-center shrink-0">
            <Icon icon="solar:card-2-bold" class="text-xl" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900">Add Funds to Wallet</h3>
            <p class="text-xs text-gray-500">
              {{ stripeConfigured ? 'Secure card checkout powered by Stripe Elements' : 'Secure top-up processed via Stripe Gateway (Test Mode)' }}
            </p>
          </div>
        </div>

        <!-- Step 1: Amount selector (always visible in simulation mode, or step 1 in live Stripe mode) -->
        <div v-if="!stripeConfigured || depositStep === 'amount'" class="flex flex-col gap-2">
          <label class="text-xs font-bold uppercase tracking-wider text-gray-600">Select Amount ($USD)</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              v-for="preset in [25, 50, 100, 250]"
              :key="preset"
              type="button"
              @click="depositAmount = preset"
              class="py-2 text-sm font-semibold rounded-xl border transition cursor-pointer"
              :class="depositAmount === preset ? 'border-purple bg-purple/10 text-purple font-bold' : 'border-gray-200 hover:border-gray-300 text-gray-700'"
            >
              ${{ preset }}
            </button>
          </div>

          <div class="relative mt-2">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
            <input
              type="number"
              v-model.number="depositAmount"
              min="1"
              step="1"
              placeholder="Custom amount"
              class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple text-sm font-semibold text-gray-900"
            />
          </div>
        </div>

        <!-- LIVE STRIPE ELEMENTS CHECKOUT (Step 2) -->
        <div v-if="stripeConfigured && depositStep === 'payment'" class="flex flex-col gap-4">
          <div class="flex items-center justify-between bg-purple/5 border border-purple/10 rounded-xl px-4 py-3">
            <span class="text-xs font-semibold text-gray-600">Deposit Total</span>
            <span class="text-lg font-black text-purple">${{ Number(depositAmount).toFixed(2) }} USD</span>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl p-4 min-h-[160px] flex flex-col justify-center">
            <div id="stripe-payment-element" ref="paymentElementRef"></div>
          </div>

          <div v-if="stripeError" class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
            <Icon icon="solar:danger-triangle-bold" class="text-base shrink-0" />
            <span>{{ stripeError }}</span>
          </div>
        </div>

        <!-- TEST SIMULATION FALLBACK (when live Stripe keys aren't configured) -->
        <div v-else-if="!stripeConfigured" class="bg-gray-50/80 border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Card Information (Simulation)</span>
            <button
              type="button"
              @click="fillTestCard"
              class="text-[11px] font-bold text-purple hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Icon icon="solar:magic-stick-3-linear" />
              <span>Fill Test Card</span>
            </button>
          </div>

          <div>
            <input
              type="text"
              v-model="cardNumber"
              placeholder="4242 4242 4242 4242"
              class="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-mono tracking-widest focus:outline-none focus:border-purple"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <input
              type="text"
              v-model="cardExp"
              placeholder="MM / YY"
              class="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-mono text-center focus:outline-none focus:border-purple"
            />
            <input
              type="text"
              v-model="cardCvc"
              placeholder="CVC"
              class="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-mono text-center focus:outline-none focus:border-purple"
            />
          </div>

          <p class="text-[11px] text-gray-400 flex items-center gap-1">
            <Icon icon="solar:shield-check-linear" class="text-emerald-500 text-sm" />
            <span>Stripe test simulation active. Configure STRIPE_KEY &amp; STRIPE_SECRET to enable Stripe PaymentElement.</span>
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 pt-2">
          <button
            v-if="stripeConfigured && depositStep === 'payment'"
            type="button"
            @click="resetStripeStep"
            :disabled="isSubmittingDeposit"
            class="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            &larr; Change Amount
          </button>
          <button
            v-else
            type="button"
            @click="closeDepositModal"
            class="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            v-if="stripeConfigured && depositStep === 'amount'"
            type="button"
            @click="initStripeCheckout"
            :disabled="isInitializingStripe || depositAmount <= 0"
            class="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple hover:bg-[#7144d6] disabled:opacity-50 transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Icon v-if="isInitializingStripe" icon="line-md:loading-loop" class="text-base" />
            <span>{{ isInitializingStripe ? 'Loading Stripe...' : `Continue to Card ($${depositAmount || 0})` }}</span>
          </button>

          <button
            v-else-if="stripeConfigured && depositStep === 'payment'"
            type="button"
            @click="confirmStripePayment"
            :disabled="isSubmittingDeposit"
            class="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple hover:bg-[#7144d6] disabled:opacity-50 transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Icon v-if="isSubmittingDeposit" icon="line-md:loading-loop" class="text-base" />
            <span>{{ isSubmittingDeposit ? 'Authorizing...' : `Pay $${depositAmount || 0}` }}</span>
          </button>

          <button
            v-else
            type="button"
            @click="handleSimulatedDeposit"
            :disabled="isSubmittingDeposit || depositAmount <= 0"
            class="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple hover:bg-[#7144d6] disabled:opacity-50 transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Icon v-if="isSubmittingDeposit" icon="line-md:loading-loop" class="text-base" />
            <span>{{ isSubmittingDeposit ? 'Processing...' : `Deposit $${depositAmount || 0}` }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Payout Request Modal -->
    <div
      v-if="isPayoutModalOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click.self="isPayoutModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 flex flex-col gap-6 relative animate-in fade-in zoom-in-95 duration-200">
        <!-- Close button -->
        <button
          @click="isPayoutModalOpen = false"
          class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
          <Icon icon="material-symbols:close" class="text-xl" />
        </button>

        <!-- Header -->
        <div class="flex items-center gap-3 border-b pb-4">
          <div class="w-10 h-10 rounded-xl bg-purple/10 text-purple flex items-center justify-center shrink-0">
            <Icon icon="solar:card-send-bold" class="text-xl" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900">Request Withdrawal</h3>
            <p class="text-xs text-gray-500">Transfer funds from wallet to bank or Stripe account</p>
          </div>
        </div>

        <div class="bg-violet-50/70 border border-violet-100 rounded-xl p-3 flex items-center justify-between text-xs">
          <span class="text-gray-600">Available to Withdraw:</span>
          <strong class="text-purple font-bold text-sm">${{ Number(wallet?.balance || 0).toFixed(2) }}</strong>
        </div>

        <!-- Amount input -->
        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold uppercase tracking-wider text-gray-600">Withdrawal Amount ($USD)</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
            <input
              type="number"
              v-model.number="payoutAmount"
              min="1"
              :max="wallet?.balance || 0"
              placeholder="0.00"
              class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple text-sm font-semibold text-gray-900"
            />
          </div>
          <button
            type="button"
            @click="payoutAmount = Number(wallet?.balance || 0)"
            class="text-[11px] text-purple hover:underline font-semibold self-end cursor-pointer"
          >
            Withdraw All Available
          </button>
        </div>

        <!-- Account details -->
        <div class="flex flex-col gap-3">
          <label class="text-xs font-bold uppercase tracking-wider text-gray-600">Payout Destination Details</label>
          <input
            type="text"
            v-model="payoutDetails.beneficiary_name"
            placeholder="Account Holder Full Name"
            class="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-purple"
          />
          <input
            type="text"
            v-model="payoutDetails.account_number"
            placeholder="IBAN or Account Number"
            class="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono focus:outline-none focus:border-purple"
          />
          <input
            type="text"
            v-model="payoutDetails.routing_number"
            placeholder="SWIFT / BIC / Routing Code (optional)"
            class="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono focus:outline-none focus:border-purple"
          />
        </div>

        <!-- Submit Button -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            @click="isPayoutModalOpen = false"
            class="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handlePayout"
            :disabled="isSubmittingPayout || payoutAmount <= 0 || payoutAmount > (wallet?.balance || 0)"
            class="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple hover:bg-[#7144d6] disabled:opacity-50 transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Icon v-if="isSubmittingPayout" icon="line-md:loading-loop" class="text-base" />
            <span>{{ isSubmittingPayout ? 'Submitting...' : 'Confirm Withdrawal' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, inject, type Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { loadStripe, type Stripe, type StripeElements, type StripePaymentElement } from '@stripe/stripe-js';
import { ClientHeaderVue } from '@/components/client/header';
import FreeLancerHeaderVue from '@/components/freelancer/header/Header.vue';
import RestWallet from '@/libs/RestWallet';
import UserSessionRepository from '@/libs/UserSessionRepository';
import type ToastsManager from '@/libs/ToastsManager';
import Utils from '@/libs/Utils';

const axios = inject<AxiosInstance>('axios');
const toastManager = inject<Ref<ToastsManager>>('toastManager');
const restWallet = new RestWallet(axios!);
const userSessionRepo = new UserSessionRepository(localStorage);

const accountType = ref<string | null>(null);
const wallet = ref<WalletSummary | null>(null);
const isLoading = ref<boolean>(true);
const activeFilter = ref<string>('all');

// Stripe Gateway & Elements state
const stripeConfigured = ref<boolean>(false);
const stripePublishableKey = ref<string | null>(null);
const depositStep = ref<'amount' | 'payment'>('amount');
const paymentElementRef = ref<HTMLElement | null>(null);
const isInitializingStripe = ref(false);
const stripeError = ref('');
let stripeInstance: Stripe | null = null;
let stripeElements: StripeElements | null = null;
let paymentElement: StripePaymentElement | null = null;
let activePaymentIntentId: string | null = null;

// Deposit Modal
const isDepositModalOpen = ref(false);
const depositAmount = ref<number>(50);
const cardNumber = ref('');
const cardExp = ref('');
const cardCvc = ref('');
const isSubmittingDeposit = ref(false);

// Payout Modal
const isPayoutModalOpen = ref(false);
const payoutAmount = ref<number>(0);
const payoutDetails = ref({
  beneficiary_name: '',
  account_number: '',
  routing_number: '',
});
const isSubmittingPayout = ref(false);

const filteredTransactions = computed(() => {
  if (!wallet.value || !wallet.value.transactions) return [];
  if (activeFilter.value === 'all') return wallet.value.transactions;
  return wallet.value.transactions.filter(t => t.type === activeFilter.value);
});

async function loadWallet() {
  try {
    isLoading.value = true;
    accountType.value = userSessionRepo.getAccountType();
    const [walletRes, configRes] = await Promise.all([
      restWallet.getMyWallet(),
      restWallet.getGatewayConfig(),
    ]);
    if (walletRes.isSuccess() && walletRes.value) {
      wallet.value = walletRes.value;
    }
    if (configRes.isSuccess() && configRes.value) {
      stripeConfigured.value = Boolean(configRes.value.stripe_configured);
      stripePublishableKey.value = configRes.value.publishable_key || null;
    }
  } catch (err: any) {
    console.error('Failed to load wallet:', err);
    toastManager?.value?.alertError?.('Failed to load wallet balance.');
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadWallet();
});

onBeforeUnmount(() => {
  destroyStripeElement();
});

function destroyStripeElement() {
  if (paymentElement) {
    paymentElement.destroy();
    paymentElement = null;
  }
  stripeElements = null;
  activePaymentIntentId = null;
  stripeError.value = '';
}

function openDepositModal() {
  depositAmount.value = 50;
  depositStep.value = 'amount';
  destroyStripeElement();
  fillTestCard();
  isDepositModalOpen.value = true;
}

function closeDepositModal() {
  destroyStripeElement();
  depositStep.value = 'amount';
  isDepositModalOpen.value = false;
}

function resetStripeStep() {
  destroyStripeElement();
  depositStep.value = 'amount';
}

function fillTestCard() {
  cardNumber.value = '4242 •••• •••• 4242';
  cardExp.value = '12 / 28';
  cardCvc.value = '123';
}

async function initStripeCheckout() {
  if (depositAmount.value <= 0) {
    toastManager?.value?.alertError?.('Please enter a valid deposit amount.');
    return;
  }

  try {
    isInitializingStripe.value = true;
    stripeError.value = '';

    const intentRes = await restWallet.depositIntent(depositAmount.value, 'stripe');
    if (!intentRes.isSuccess() || !intentRes.value) {
      throw new Error(intentRes.error || 'Failed to initialize payment.');
    }

    const { payment_id, client_secret, publishable_key, mode } = intentRes.value;

    // If backend fell back to test simulation, complete via simulated flow
    if (mode === 'test_simulation' || !publishable_key) {
      stripeConfigured.value = false;
      const confirmRes = await restWallet.confirmDeposit(payment_id, depositAmount.value, 'stripe');
      if (!confirmRes.isSuccess()) {
        throw new Error(confirmRes.error || 'Failed to confirm deposit.');
      }
      toastManager?.value?.alertSuccess?.(`Successfully added $${depositAmount.value.toFixed(2)} to your balance!`);
      closeDepositModal();
      await loadWallet();
      return;
    }

    activePaymentIntentId = payment_id;
    stripeInstance = await loadStripe(publishable_key);
    if (!stripeInstance) {
      throw new Error('Failed to load Stripe.js.');
    }

    depositStep.value = 'payment';
    await nextTick();

    stripeElements = stripeInstance.elements({
      clientSecret: client_secret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#7c3aed',
          borderRadius: '12px',
        },
      },
    });

    paymentElement = stripeElements.create('payment');
    if (paymentElementRef.value) {
      paymentElement.mount(paymentElementRef.value);
    }
  } catch (err: any) {
    console.error('Stripe initialization error:', err);
    toastManager?.value?.alertError?.(err.message || 'Could not start Stripe checkout.');
    depositStep.value = 'amount';
  } finally {
    isInitializingStripe.value = false;
  }
}

async function confirmStripePayment() {
  if (!stripeInstance || !stripeElements) {
    stripeError.value = 'Stripe payment form is not ready.';
    return;
  }

  try {
    isSubmittingDeposit.value = true;
    stripeError.value = '';

    const { error, paymentIntent } = await stripeInstance.confirmPayment({
      elements: stripeElements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    if (error) {
      stripeError.value = error.message || 'Card payment failed.';
      toastManager?.value?.alertError?.(stripeError.value);
      return;
    }

    const confirmedId = paymentIntent?.id || activePaymentIntentId;
    if (!confirmedId || paymentIntent?.status !== 'succeeded') {
      stripeError.value = `Payment status: ${paymentIntent?.status || 'incomplete'}. Please complete authentication.`;
      return;
    }

    const confirmRes = await restWallet.confirmDeposit(confirmedId, depositAmount.value, 'stripe');
    if (!confirmRes.isSuccess() || !confirmRes.value) {
      throw new Error(confirmRes.error || 'Failed to credit wallet after payment.');
    }

    toastManager?.value?.alertSuccess?.(`Successfully added $${depositAmount.value.toFixed(2)} to your balance!`);
    closeDepositModal();
    await loadWallet();
  } catch (err: any) {
    console.error('Stripe confirmation error:', err);
    stripeError.value = err.message || 'Payment confirmation failed.';
    toastManager?.value?.alertError?.(stripeError.value);
  } finally {
    isSubmittingDeposit.value = false;
  }
}

async function handleSimulatedDeposit() {
  if (depositAmount.value <= 0) {
    toastManager?.value?.alertError?.('Please enter a valid deposit amount.');
    return;
  }

  try {
    isSubmittingDeposit.value = true;
    const intentRes = await restWallet.depositIntent(depositAmount.value, 'stripe');
    if (!intentRes.isSuccess() || !intentRes.value) {
      throw new Error(intentRes.error || 'Failed to create deposit intent.');
    }

    const paymentId = intentRes.value.payment_id;
    const confirmRes = await restWallet.confirmDeposit(paymentId, depositAmount.value, 'stripe');
    if (!confirmRes.isSuccess() || !confirmRes.value) {
      throw new Error(confirmRes.error || 'Failed to confirm deposit.');
    }

    toastManager?.value?.alertSuccess?.(`Successfully added $${depositAmount.value.toFixed(2)} to your balance!`);
    closeDepositModal();
    await loadWallet();
  } catch (err: any) {
    console.error('Deposit error:', err);
    toastManager?.value?.alertError?.(err.message || 'Deposit failed.');
  } finally {
    isSubmittingDeposit.value = false;
  }
}

function openPayoutModal() {
  payoutAmount.value = wallet.value ? Math.min(wallet.value.balance, 50) : 0;
  payoutDetails.value = {
    beneficiary_name: '',
    account_number: '',
    routing_number: '',
  };
  isPayoutModalOpen.value = true;
}

async function handlePayout() {
  if (payoutAmount.value <= 0) {
    toastManager?.value?.alertError?.('Please enter a valid payout amount.');
    return;
  }

  if (wallet.value && payoutAmount.value > wallet.value.balance) {
    toastManager?.value?.alertError?.('Requested amount exceeds available balance.');
    return;
  }

  try {
    isSubmittingPayout.value = true;
    const res = await restWallet.requestPayout(payoutAmount.value, 'stripe', payoutDetails.value);
    if (!res.isSuccess() || !res.value) {
      throw new Error(res.error || 'Failed to request payout.');
    }

    toastManager?.value?.alertSuccess?.('Payout request submitted! Admin will review and process.');
    isPayoutModalOpen.value = false;
    await loadWallet();
  } catch (err: any) {
    console.error('Payout request error:', err);
    toastManager?.value?.alertError?.(err.message || 'Failed to request payout.');
  } finally {
    isSubmittingPayout.value = false;
  }
}

function formatDate(dateStr: string) {
  return Utils.formatDateTime(dateStr);
}

function getTypeBadgeClass(type: string) {
  switch (type) {
    case 'deposit':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    case 'escrow_lock':
      return 'bg-amber-50 text-amber-700 border border-amber-100';
    case 'escrow_release':
      return 'bg-blue-50 text-blue-700 border border-blue-100';
    case 'escrow_refund':
      return 'bg-purple/10 text-purple border border-purple/20';
    case 'payout':
      return 'bg-rose-50 text-rose-700 border border-rose-100';
    case 'platform_fee':
      return 'bg-gray-100 text-gray-700 border border-gray-200';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'deposit':
      return 'solar:card-recive-bold';
    case 'escrow_lock':
      return 'solar:lock-keyhole-bold';
    case 'escrow_release':
      return 'solar:check-circle-bold';
    case 'escrow_refund':
      return 'solar:restart-bold';
    case 'payout':
      return 'solar:card-send-bold';
    case 'platform_fee':
      return 'solar:tag-price-bold';
    default:
      return 'solar:transfer-horizontal-bold';
  }
}
</script>
