<?php

namespace App\Http\Controllers;

use App\Models\Proposal;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProposalController extends Controller
{

    public function store(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        $validated = $request->validate([
            'job_post_id' => 'required|exists:job_posts,id',
            'cover_letter' => 'required',
        ]);
        $validated['freelancer_id'] = $user->id;

        $proposal = Proposal::create($validated);
        return response()->json($proposal, 201);
    }
    
    public function getByJobPostAndFreelancer($jobPostId): JsonResponse
    {
        $user = auth('api')->user();
        $proposal = Proposal::where('job_post_id', $jobPostId)
            ->where('freelancer_id', $user->id)
            ->first();

        if ($proposal) {
            return response()->json($proposal, 200);
        } else {
            return response()->json(['message' => 'Proposal not found'], 404);
        }
    }
}
