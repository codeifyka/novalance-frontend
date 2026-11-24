<template>
  <div class="w-full min-h-screen bg-gray-50/40 flex flex-col items-center pt-24 md:pt-28 pb-20">
    <!-- Admin Top Navbar -->
    <nav class="w-full h-16 md:h-20 shadow-sm flex px-8 md:px-24 justify-between items-center fixed top-0 z-50 bg-white border-b border-gray-100">
      <router-link to="/admin" class="flex items-center gap-2 cursor-pointer">
        <img src="/logo.png" class="h-8 object-contain rounded-full" alt="NovaLance logo" />
        <span class="text-black text-xl font-bold inline-block hover:text-purple">NovaLance</span>
        <span class="ml-2 px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-purple text-white shadow-xs">
          Admin Portal
        </span>
      </router-link>

      <div class="flex items-center gap-6">
        <router-link to="/wallet" class="text-sm font-semibold text-gray-700 hover:text-purple transition flex items-center gap-1.5">
          <Icon icon="solar:wallet-bold" class="text-base text-purple" />
          <span>Platform Wallet</span>
        </router-link>
        <router-link to="/admin" class="text-sm font-semibold text-gray-700 hover:text-purple transition flex items-center gap-1.5">
          <Icon icon="solar:home-smile-linear" class="text-base" />
          <span>Dashboard</span>
        </router-link>

        <div class="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div class="w-8 h-8 rounded-full bg-purple/10 text-purple flex items-center justify-center font-bold text-xs uppercase">
            {{ adminUser?.first_name ? adminUser.first_name[0] : 'A' }}
          </div>
          <span class="text-xs font-semibold text-gray-700 hidden sm:inline">
            {{ adminUser?.username || 'Administrator' }}
          </span>
          <button
            type="button"
            @click="logout"
            class="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 ml-2 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
            title="Log Out"
          >
            <Icon icon="solar:logout-2-bold" class="text-base" />
            <span class="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Unauthorized Banner if non-admin -->
    <div v-if="isLoaded && (!adminUser || adminUser.account_type !== 'admin') && userSessionRepo.getAccountType() !== 'admin'" class="w-11/12 max-w-xl bg-white rounded-2xl p-8 border border-red-200 shadow-md text-center flex flex-col items-center gap-4 mt-12">
      <div class="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
        <Icon icon="solar:shield-warning-bold" class="text-3xl" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900">Access Restricted</h2>
      <p class="text-sm text-gray-500">
        You must be signed in with an Administrator account to view dispute cases and process payment requests.
      </p>
      <router-link
        to="/home"
        class="bg-purple text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#7144d6] transition mt-2 cursor-pointer"
      >
        Return to Home
      </router-link>
    </div>

    <!-- Admin Content -->
    <div v-else class="w-11/12 max-w-6xl flex flex-col gap-8 mt-2">
      <!-- Page Header & Metrics Summary -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900">Admin Control Center</h1>
          <p class="text-sm text-gray-500 mt-1">
            Resolve contract disputes, review chat evidence, and authorize Stripe payouts.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="refreshData"
            :disabled="isLoading"
            class="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Icon icon="solar:restart-bold" :class="{ 'animate-spin': isLoading }" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <!-- Open Disputes Card -->
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Open Disputes</span>
            <div class="text-3xl font-black text-rose-600 mt-1">
              {{ openDisputesCount }}
            </div>
            <p class="text-[11px] text-gray-400 mt-1">Require arbitration & verdict</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Icon icon="solar:shield-warning-bold" class="text-2xl" />
          </div>
        </div>

        <!-- Pending Payouts Card -->
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Pending Withdrawals</span>
            <div class="text-3xl font-black text-amber-600 mt-1">
              {{ pendingPayoutsCount }}
            </div>
            <p class="text-[11px] text-gray-400 mt-1">Freelancer payout requests</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Icon icon="solar:card-send-bold" class="text-2xl" />
          </div>
        </div>

        <!-- Strategy Mode -->
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Gateway Strategy</span>
            <div class="text-xl font-bold text-gray-900 mt-1 flex items-center gap-2">
              <Icon icon="logos:stripe" class="h-5 object-contain" />
              <span>Simulation</span>
            </div>
            <p class="text-[11px] text-gray-400 mt-1">Encapsulated Driver: Stripe</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple/10 text-purple flex items-center justify-center">
            <Icon icon="solar:tuning-square-2-bold" class="text-2xl" />
          </div>
        </div>
      </div>

      <!-- Main Tabs Navigation -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div class="flex items-center gap-4">
            <button
              @click="activeTab = 'disputes'"
              class="px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition cursor-pointer"
              :class="activeTab === 'disputes' ? 'bg-purple text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              <Icon icon="solar:shield-warning-bold" class="text-lg" />
              <span>Disputes Management</span>
              <span
                v-if="openDisputesCount > 0"
                class="px-2 py-0.5 rounded-full text-xs font-extrabold"
                :class="activeTab === 'disputes' ? 'bg-white text-purple' : 'bg-rose-500 text-white'"
              >
                {{ openDisputesCount }}
              </span>
            </button>

            <button
              @click="activeTab = 'payouts'"
              class="px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition cursor-pointer"
              :class="activeTab === 'payouts' ? 'bg-purple text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              <Icon icon="solar:card-send-bold" class="text-lg" />
              <span>Payout Requests</span>
              <span
                v-if="pendingPayoutsCount > 0"
                class="px-2 py-0.5 rounded-full text-xs font-extrabold"
                :class="activeTab === 'payouts' ? 'bg-white text-purple' : 'bg-amber-500 text-white'"
              >
                {{ pendingPayoutsCount }}
              </span>
            </button>
          </div>

          <!-- Status Sub-filter -->
          <div v-if="activeTab === 'disputes'" class="flex items-center gap-2 overflow-x-auto">
            <button
              v-for="s in ['all', 'open', 'resolved_refund_client', 'resolved_partial', 'resolved_release_freelancer']"
              :key="s"
              @click="disputeFilter = s"
              class="px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition cursor-pointer"
              :class="disputeFilter === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              {{ s.replace('resolved_', '').replace(/_/g, ' ') }}
            </button>
          </div>

          <div v-else class="flex items-center gap-2 overflow-x-auto">
            <button
              v-for="s in ['all', 'pending', 'completed', 'rejected']"
              :key="s"
              @click="payoutFilter = s"
              class="px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition cursor-pointer"
              :class="payoutFilter === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              {{ s }}
            </button>
          </div>
        </div>

        <!-- TAB 1: DISPUTES TABLE -->
        <div v-if="activeTab === 'disputes'" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                <th class="py-3 px-4">Case ID</th>
                <th class="py-3 px-4">Contract / Job</th>
                <th class="py-3 px-4">Client</th>
                <th class="py-3 px-4">Freelancer</th>
                <th class="py-3 px-4">Escrow Bid</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-if="isLoading" class="text-center">
                <td colspan="7" class="py-12 text-gray-400">Loading disputes...</td>
              </tr>
              <tr v-else-if="filteredDisputes.length === 0" class="text-center">
                <td colspan="7" class="py-12">
                  <div class="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <Icon icon="solar:check-circle-bold" class="text-4xl text-emerald-500" />
                    <p class="text-sm font-medium">No disputes in this view.</p>
                  </div>
                </td>
              </tr>
              <tr
                v-for="dispute in filteredDisputes"
                :key="dispute.id"
                class="hover:bg-gray-50/60 transition-colors"
              >
                <!-- Case ID -->
                <td class="py-3.5 px-4 font-mono text-xs font-semibold text-gray-500">
                  #DIS-{{ String(dispute.id).padStart(5, '0') }}
                </td>

                <!-- Contract Title -->
                <td class="py-3.5 px-4 font-semibold text-gray-900">
                  <div class="max-w-xs truncate">
                    {{ dispute.proposal?.job_post?.title || `Proposal #${dispute.proposal_id}` }}
                  </div>
                  <span class="text-[11px] text-gray-400 block truncate font-normal">
                    {{ dispute.reason }}
                  </span>
                </td>

                <!-- Client -->
                <td class="py-3.5 px-4 text-xs font-medium text-gray-700">
                  {{ [dispute.client?.first_name, dispute.client?.last_name].filter(Boolean).join(' ') || dispute.client?.username || 'Client' }}
                </td>

                <!-- Freelancer -->
                <td class="py-3.5 px-4 text-xs font-medium text-gray-700">
                  {{ [dispute.freelancer?.first_name, dispute.freelancer?.last_name].filter(Boolean).join(' ') || dispute.freelancer?.username || 'Freelancer' }}
                </td>

                <!-- Escrow Bid -->
                <td class="py-3.5 px-4 font-bold text-gray-900">
                  ${{ Number(dispute.proposal?.bid || 0).toFixed(2) }}
                </td>

                <!-- Status -->
                <td class="py-3.5 px-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize inline-flex items-center gap-1"
                    :class="getDisputeBadgeClass(dispute.status)"
                  >
                    <Icon :icon="getDisputeIcon(dispute.status)" />
                    {{ dispute.status.replace('resolved_', '').replace(/_/g, ' ') }}
                  </span>
                </td>

                <!-- Action Button -->
                <td class="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    @click="openDisputeDetailModal(dispute)"
                    class="bg-purple text-white hover:bg-[#7144d6] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                  >
                    <Icon icon="solar:eye-bold" />
                    <span>Review Case</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- TAB 2: PAYOUTS TABLE -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                <th class="py-3 px-4">Request ID</th>
                <th class="py-3 px-4">Freelancer</th>
                <th class="py-3 px-4">Amount</th>
                <th class="py-3 px-4">Gateway</th>
                <th class="py-3 px-4">Account Details</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-if="isLoading" class="text-center">
                <td colspan="7" class="py-12 text-gray-400">Loading payout requests...</td>
              </tr>
              <tr v-else-if="filteredPayouts.length === 0" class="text-center">
                <td colspan="7" class="py-12">
                  <div class="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <Icon icon="solar:check-circle-bold" class="text-4xl text-emerald-500" />
                    <p class="text-sm font-medium">No payout requests in this view.</p>
                  </div>
                </td>
              </tr>
              <tr
                v-for="payout in filteredPayouts"
                :key="payout.id"
                class="hover:bg-gray-50/60 transition-colors"
              >
                <!-- Request ID -->
                <td class="py-3.5 px-4 font-mono text-xs font-semibold text-gray-500">
                  #PAY-{{ String(payout.id).padStart(5, '0') }}
                </td>

                <!-- Freelancer -->
                <td class="py-3.5 px-4">
                  <div class="font-semibold text-gray-900 text-xs">
                    {{ [payout.user?.first_name, payout.user?.last_name].filter(Boolean).join(' ') || payout.user?.username }}
                  </div>
                  <span class="text-[11px] text-gray-400">{{ payout.user?.email }}</span>
                </td>

                <!-- Amount -->
                <td class="py-3.5 px-4 font-bold text-gray-900">
                  ${{ Number(payout.amount).toFixed(2) }}
                </td>

                <!-- Gateway Provider -->
                <td class="py-3.5 px-4">
                  <span class="px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase bg-gray-100 text-gray-700">
                    {{ payout.provider }}
                  </span>
                </td>

                <!-- Destination Details -->
                <td class="py-3.5 px-4 text-xs text-gray-600 font-mono">
                  <div v-if="payout.provider_data?.account_details">
                    <div>{{ payout.provider_data.account_details.beneficiary_name }}</div>
                    <div class="text-gray-400">{{ payout.provider_data.account_details.account_number }}</div>
                  </div>
                  <span v-else class="text-gray-400 italic">Direct Deposit</span>
                </td>

                <!-- Status -->
                <td class="py-3.5 px-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    :class="payout.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : payout.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'"
                  >
                    {{ payout.status }}
                  </span>
                </td>

                <!-- Action Button -->
                <td class="py-3.5 px-4 text-right">
                  <div v-if="payout.status === 'pending'" class="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      @click="processPayout(payout)"
                      :disabled="isProcessingPayout === payout.id"
                      class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs inline-flex items-center gap-1"
                      title="Authorize and execute payout via Stripe"
                    >
                      <Icon v-if="isProcessingPayout === payout.id" icon="line-md:loading-loop" />
                      <span>Approve</span>
                    </button>

                    <button
                      type="button"
                      @click="rejectPayout(payout)"
                      :disabled="isProcessingPayout === payout.id"
                      class="bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1"
                      title="Reject request and refund freelancer balance"
                    >
                      <span>Reject</span>
                    </button>
                  </div>
                  <span v-else class="text-xs text-gray-400 italic">
                    {{ payout.processed_at ? formatDate(payout.processed_at) : 'Processed' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- DISPUTE RESOLUTION MODAL -->
    <div
      v-if="selectedDispute"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto"
      @click.self="selectedDispute = null"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 flex flex-col gap-6 relative my-8 max-h-[90vh] overflow-y-auto">
        <button
          @click="selectedDispute = null"
          class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
          <Icon icon="material-symbols:close" class="text-xl" />
        </button>

        <!-- Header -->
        <div class="flex items-center gap-3 border-b pb-4">
          <div class="w-10 h-10 rounded-xl bg-purple/10 text-purple flex items-center justify-center shrink-0">
            <Icon icon="solar:shield-warning-bold" class="text-xl" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900">
              Dispute Case #DIS-{{ String(selectedDispute.id).padStart(5, '0') }}
            </h3>
            <p class="text-xs text-gray-500">
              Contract: {{ selectedDispute.proposal?.job_post?.title || 'Job Contract' }}
            </p>
          </div>
        </div>

        <!-- Dispute Info Cards -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs flex flex-col gap-1">
            <span class="text-gray-400 font-semibold uppercase">Client</span>
            <strong class="text-gray-900 text-sm">
              {{ [selectedDispute.client?.first_name, selectedDispute.client?.last_name].filter(Boolean).join(' ') || selectedDispute.client?.username }}
            </strong>
            <span class="text-gray-500">{{ selectedDispute.client?.email }}</span>
          </div>

          <div class="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs flex flex-col gap-1">
            <span class="text-gray-400 font-semibold uppercase">Freelancer</span>
            <strong class="text-gray-900 text-sm">
              {{ [selectedDispute.freelancer?.first_name, selectedDispute.freelancer?.last_name].filter(Boolean).join(' ') || selectedDispute.freelancer?.username }}
            </strong>
            <span class="text-gray-500">{{ selectedDispute.freelancer?.email }}</span>
          </div>
        </div>

        <!-- Escrow Total -->
        <div class="bg-violet-50/70 border border-violet-100 rounded-xl p-3 flex items-center justify-between text-xs">
          <span class="text-gray-600">Locked Escrow Bid Amount:</span>
          <strong class="text-purple font-extrabold text-base">
            ${{ Number(selectedDispute.proposal?.bid || 0).toFixed(2) }}
          </strong>
        </div>

        <!-- Reason Submitted by Client -->
        <div class="flex flex-col gap-1.5">
          <span class="text-xs font-bold uppercase tracking-wider text-gray-600">Client's Dispute Reason:</span>
          <div class="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 leading-relaxed italic">
            "{{ selectedDispute.reason }}"
          </div>
        </div>

        <!-- Chat Conversation Evidence Context -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-600">Chat History Evidence:</span>
            <span class="text-[11px] text-gray-400">{{ disputeChatMessages.length }} messages on file</span>
          </div>
          <div class="h-44 overflow-y-auto bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col gap-2">
            <div v-if="disputeChatMessages.length === 0" class="text-xs text-gray-400 italic text-center py-6">
              No recent chat messages found between client and freelancer.
            </div>
            <div
              v-for="msg in disputeChatMessages"
              :key="msg.id"
              class="text-xs flex flex-col p-2 bg-white rounded-lg border border-gray-100 shadow-2xs"
            >
              <div class="flex justify-between items-center text-[10px] text-gray-400 mb-1">
                <span class="font-bold text-gray-600">
                  {{ msg.sender === selectedDispute.client_id ? 'Client' : 'Freelancer' }}
                </span>
                <span>{{ formatDate(msg.created_at) }}</span>
              </div>
              <span class="text-gray-800">{{ msg.message }}</span>
            </div>
          </div>
        </div>

        <!-- Resolution Form (Only if dispute is still open) -->
        <div v-if="selectedDispute.status === 'open' || selectedDispute.status === 'under_review'" class="border-t pt-4 flex flex-col gap-4">
          <h4 class="text-xs font-bold uppercase tracking-wider text-gray-700">Administrator Verdict</h4>

          <!-- Resolution Type Radios -->
          <div class="grid grid-cols-3 gap-2">
            <button
              type="button"
              @click="resolutionType = 'full_refund'"
              class="p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1"
              :class="resolutionType === 'full_refund' ? 'border-purple bg-purple/10 text-purple' : 'border-gray-200 hover:border-gray-300 text-gray-700'"
            >
              <span class="text-xs font-bold">Full Refund</span>
              <span class="text-[10px] text-gray-500">100% to Client (Fail)</span>
            </button>

            <button
              type="button"
              @click="resolutionType = 'partial_refund'"
              class="p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1"
              :class="resolutionType === 'partial_refund' ? 'border-purple bg-purple/10 text-purple' : 'border-gray-200 hover:border-gray-300 text-gray-700'"
            >
              <span class="text-xs font-bold">Partial Split</span>
              <span class="text-[10px] text-gray-500">Custom Split</span>
            </button>

            <button
              type="button"
              @click="resolutionType = 'release_freelancer'"
              class="p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1"
              :class="resolutionType === 'release_freelancer' ? 'border-purple bg-purple/10 text-purple' : 'border-gray-200 hover:border-gray-300 text-gray-700'"
            >
              <span class="text-xs font-bold">Release Freelancer</span>
              <span class="text-[10px] text-gray-500">Work Approved</span>
            </button>
          </div>

          <!-- Partial inputs if partial selected -->
          <div v-if="resolutionType === 'partial_refund'" class="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div>
              <label class="text-[11px] font-bold text-gray-600 block mb-1">Refund to Client ($)</label>
              <input
                type="number"
                v-model.number="partialClientAmount"
                step="0.5"
                min="0"
                class="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none focus:border-purple"
              />
            </div>
            <div>
              <label class="text-[11px] font-bold text-gray-600 block mb-1">Pay to Freelancer ($)</label>
              <input
                type="number"
                v-model.number="partialFreelancerAmount"
                step="0.5"
                min="0"
                class="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none focus:border-purple"
              />
            </div>
          </div>

          <!-- Admin Notes -->
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold uppercase tracking-wider text-gray-600">Admin Notes / Justification</label>
            <input
              type="text"
              v-model="adminNotes"
              placeholder="e.g. Freelancer provided deliverables but missed final milestone..."
              class="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-purple"
            />
          </div>

          <!-- Confirm Verdict Button -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              @click="selectedDispute = null"
              class="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="confirmResolveDispute"
              :disabled="isResolving"
              class="bg-purple hover:bg-[#7144d6] text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Icon v-if="isResolving" icon="line-md:loading-loop" />
              <span>Confirm & Enforce Verdict</span>
            </button>
          </div>
        </div>

        <!-- Already Resolved State -->
        <div v-else class="border-t pt-4 flex flex-col gap-2 text-xs">
          <span class="font-bold text-gray-700">Resolution Record:</span>
          <div class="bg-gray-50 rounded-xl p-3 border border-gray-200 text-gray-600 flex flex-col gap-1">
            <div>Status: <strong class="capitalize">{{ selectedDispute.status.replace(/_/g, ' ') }}</strong></div>
            <div v-if="selectedDispute.client_refund_amount">Refunded Client: <strong>${{ selectedDispute.client_refund_amount }}</strong></div>
            <div v-if="selectedDispute.freelancer_amount">Paid Freelancer: <strong>${{ selectedDispute.freelancer_amount }}</strong></div>
            <div v-if="selectedDispute.admin_notes">Notes: <em>"{{ selectedDispute.admin_notes }}"</em></div>
            <div class="text-[10px] text-gray-400 mt-1">Resolved on {{ formatDate(selectedDispute.resolved_at || selectedDispute.updated_at) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, inject, type Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import RestAdmin from '@/libs/RestAdmin';
import RestUserSession from '@/libs/RestUserSession';
import UserSessionRepository from '@/libs/UserSessionRepository';
import type ToastsManager from '@/libs/ToastsManager';
import Utils from '@/libs/Utils';

const axios = inject<AxiosInstance>('axios');
const toastManager = inject<Ref<ToastsManager>>('toastManager');
const restAdmin = new RestAdmin(axios!);
const userSessionRepo = new UserSessionRepository(localStorage);

const adminUser = ref<User | null>(null);
const isLoaded = ref(false);
const isLoading = ref(true);

function logout() {
  userSessionRepo.clear();
  window.location.href = '/sign_in';
}

const activeTab = ref<'disputes' | 'payouts'>('disputes');
const disputeFilter = ref('all');
const payoutFilter = ref('all');

const disputes = ref<Dispute[]>([]);
const payouts = ref<PayoutRequest[]>([]);

// Dispute Detail / Resolution Modal
const selectedDispute = ref<Dispute | null>(null);
const disputeChatMessages = ref<any[]>([]);
const resolutionType = ref<'full_refund' | 'partial_refund' | 'release_freelancer'>('full_refund');
const partialClientAmount = ref<number>(0);
const partialFreelancerAmount = ref<number>(0);
const adminNotes = ref('');
const isResolving = ref(false);

// Payout processing state
const isProcessingPayout = ref<number | null>(null);

const openDisputesCount = computed(() => {
  return disputes.value.filter(d => d.status === 'open' || d.status === 'under_review').length;
});

const pendingPayoutsCount = computed(() => {
  return payouts.value.filter(p => p.status === 'pending').length;
});

const filteredDisputes = computed(() => {
  if (disputeFilter.value === 'all') return disputes.value;
  return disputes.value.filter(d => d.status === disputeFilter.value);
});

const filteredPayouts = computed(() => {
  if (payoutFilter.value === 'all') return payouts.value;
  return payouts.value.filter(p => p.status === payoutFilter.value);
});

async function checkAdminAndLoad() {
  try {
    isLoading.value = true;
    const localAccountType = userSessionRepo.getAccountType();

    // Fast-path: if session indicates admin, load admin data immediately
    if (localAccountType === 'admin') {
      await refreshData();
    }

    const sessionService = new RestUserSession(axios!);
    const userRes = await sessionService.getInfo();
    if (userRes.isSuccess() && userRes.value?.user) {
      adminUser.value = userRes.value.user;
      if (localAccountType !== 'admin' && adminUser.value.account_type === 'admin') {
        await refreshData();
      }
    }
  } catch (err) {
    console.error('Failed to authenticate admin:', err);
  } finally {
    isLoaded.value = true;
    isLoading.value = false;
  }
}

async function refreshData() {
  try {
    isLoading.value = true;
    const [disputesRes, payoutsRes] = await Promise.all([
      restAdmin.getDisputes(),
      restAdmin.getPayouts(),
    ]);

    if (disputesRes.isSuccess() && disputesRes.value) {
      disputes.value = disputesRes.value;
    }

    if (payoutsRes.isSuccess() && payoutsRes.value) {
      payouts.value = payoutsRes.value;
    }
  } catch (err: any) {
    console.error('Failed to load admin data:', err);
    toastManager?.value?.alertError?.('Failed to load admin data.');
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  checkAdminAndLoad();
});

async function openDisputeDetailModal(dispute: Dispute) {
  selectedDispute.value = dispute;
  resolutionType.value = 'full_refund';
  adminNotes.value = '';
  const bid = Number(dispute.proposal?.bid || 0);
  partialClientAmount.value = Math.round((bid / 2) * 100) / 100;
  partialFreelancerAmount.value = Math.round((bid / 2) * 100) / 100;
  disputeChatMessages.value = [];

  try {
    const detailRes = await restAdmin.getDispute(dispute.id);
    if (detailRes.isSuccess() && detailRes.value) {
      if (detailRes.value.chat?.messages) {
        disputeChatMessages.value = detailRes.value.chat.messages;
      }
    }
  } catch (err) {
    console.error('Failed to load dispute evidence:', err);
  }
}

async function confirmResolveDispute() {
  if (!selectedDispute.value) return;

  const bid = Number(selectedDispute.value.proposal?.bid || 0);
  if (resolutionType.value === 'partial_refund') {
    if (partialClientAmount.value + partialFreelancerAmount.value > bid) {
      toastManager?.value?.alertError?.(`Total split ($${partialClientAmount.value} + $${partialFreelancerAmount.value}) exceeds bid ($${bid}).`);
      return;
    }
  }

  try {
    isResolving.value = true;
    const res = await restAdmin.resolveDispute(
      selectedDispute.value.id,
      resolutionType.value,
      resolutionType.value === 'partial_refund' ? partialClientAmount.value : undefined,
      resolutionType.value === 'partial_refund' ? partialFreelancerAmount.value : undefined,
      adminNotes.value
    );

    if (res.isSuccess()) {
      toastManager?.value?.alertSuccess?.('Dispute resolved successfully!');
      selectedDispute.value = null;
      await refreshData();
    } else {
      toastManager?.value?.alertError?.(res.error || 'Failed to resolve dispute.');
    }
  } catch (err: any) {
    const msg = err.response?.data?.error || err.message || 'Failed to resolve dispute.';
    toastManager?.value?.alertError?.(msg);
  } finally {
    isResolving.value = false;
  }
}

async function processPayout(payout: PayoutRequest) {
  try {
    isProcessingPayout.value = payout.id;
    const res = await restAdmin.processPayout(payout.id, 'Approved and executed via Stripe Gateway');
    if (res.isSuccess()) {
      toastManager?.value?.alertSuccess?.(`Payout #PAY-${payout.id} processed successfully!`);
      await refreshData();
    } else {
      toastManager?.value?.alertError?.(res.error || 'Failed to process payout.');
    }
  } catch (err: any) {
    const msg = err.response?.data?.error || err.message || 'Payout processing failed.';
    toastManager?.value?.alertError?.(msg);
  } finally {
    isProcessingPayout.value = null;
  }
}

async function rejectPayout(payout: PayoutRequest) {
  try {
    isProcessingPayout.value = payout.id;
    const res = await restAdmin.rejectPayout(payout.id, 'Rejected by administrator. Funds refunded to wallet.');
    if (res.isSuccess()) {
      toastManager?.value?.alertSuccess?.(`Payout #PAY-${payout.id} rejected and refunded to freelancer.`);
      await refreshData();
    } else {
      toastManager?.value?.alertError?.(res.error || 'Failed to reject payout.');
    }
  } catch (err: any) {
    const msg = err.response?.data?.error || err.message || 'Failed to reject payout.';
    toastManager?.value?.alertError?.(msg);
  } finally {
    isProcessingPayout.value = null;
  }
}

function formatDate(dateStr: string) {
  return Utils.formatDateTime(dateStr);
}

function getDisputeBadgeClass(status: string) {
  switch (status) {
    case 'open':
    case 'under_review':
      return 'bg-amber-100 text-amber-800';
    case 'resolved_refund_client':
      return 'bg-rose-100 text-rose-800';
    case 'resolved_partial':
      return 'bg-purple/10 text-purple';
    case 'resolved_release_freelancer':
      return 'bg-emerald-100 text-emerald-800';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function getDisputeIcon(status: string) {
  switch (status) {
    case 'open':
    case 'under_review':
      return 'solar:danger-triangle-bold';
    case 'resolved_refund_client':
      return 'solar:restart-bold';
    case 'resolved_partial':
      return 'solar:scale-bold';
    case 'resolved_release_freelancer':
      return 'solar:check-circle-bold';
    default:
      return 'solar:info-circle-bold';
  }
}
</script>
