import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * LLMWorks Benchmarks Edge Function
 *
 * Endpoints:
 * - GET /benchmarks - List available benchmarks
 * - GET /benchmarks/:id/results - Get benchmark results
 * - POST /benchmarks/:id/run - Run a benchmark
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const benchmarkId = pathParts.length > 1 ? pathParts[1] : null;

    // GET - List benchmarks or get results
    if (req.method === 'GET') {
      if (benchmarkId && pathParts[2] === 'results') {
        // Get results for specific benchmark
        const { data, error } = await supabase
          .from('benchmark_results')
          .select('*')
          .eq('benchmark_id', benchmarkId)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        // List available benchmarks
        const benchmarks = [
          { id: 'mmlu', name: 'MMLU', description: 'Massive Multitask Language Understanding', categories: 57 },
          { id: 'hellaswag', name: 'HellaSwag', description: 'Commonsense reasoning', categories: 1 },
          { id: 'truthfulqa', name: 'TruthfulQA', description: 'Truthfulness evaluation', categories: 38 },
          { id: 'arc', name: 'ARC', description: 'AI2 Reasoning Challenge', categories: 2 },
          { id: 'winogrande', name: 'WinoGrande', description: 'Commonsense inference', categories: 1 },
          { id: 'gsm8k', name: 'GSM8K', description: 'Grade school math problems', categories: 1 },
        ];

        return new Response(JSON.stringify(benchmarks), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // POST - Run benchmark
    if (req.method === 'POST' && benchmarkId && pathParts[2] === 'run') {
      const body = await req.json();

      // Create a benchmark run record
      const { data: run, error } = await supabase
        .from('benchmark_runs')
        .insert({
          user_id: user.id,
          benchmark_id: benchmarkId,
          models: body.models,
          config: body.config || {},
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // TODO: In production, this would trigger an async job
      // For now, return the pending run
      return new Response(
        JSON.stringify({
          runId: run.id,
          status: 'pending',
          message: 'Benchmark run queued. Check status with GET /benchmarks/:id/results',
        }),
        {
          status: 202,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Benchmarks API error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
