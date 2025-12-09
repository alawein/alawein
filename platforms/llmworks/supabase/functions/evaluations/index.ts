import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * LLMWorks Evaluations Edge Function
 *
 * Endpoints:
 * - GET /evaluations - List user's evaluations
 * - GET /evaluations/:id - Get specific evaluation
 * - POST /evaluations - Create new evaluation
 * - PUT /evaluations/:id - Update evaluation
 * - DELETE /evaluations/:id - Delete evaluation
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
    const evaluationId = pathParts.length > 1 ? pathParts[1] : null;

    // GET - List or get specific evaluation
    if (req.method === 'GET') {
      if (evaluationId) {
        const { data, error } = await supabase
          .from('evaluations')
          .select('*')
          .eq('id', evaluationId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        const { data, error } = await supabase
          .from('evaluations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // POST - Create evaluation
    if (req.method === 'POST') {
      const body = await req.json();

      const { data, error } = await supabase
        .from('evaluations')
        .insert({
          user_id: user.id,
          name: body.name,
          description: body.description,
          type: body.type || 'arena',
          models: body.models,
          config: body.config,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT - Update evaluation
    if (req.method === 'PUT' && evaluationId) {
      const body = await req.json();

      const { data, error } = await supabase
        .from('evaluations')
        .update({
          name: body.name,
          description: body.description,
          config: body.config,
          status: body.status,
          results: body.results,
          updated_at: new Date().toISOString(),
        })
        .eq('id', evaluationId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE - Delete evaluation
    if (req.method === 'DELETE' && evaluationId) {
      const { error } = await supabase.from('evaluations').delete().eq('id', evaluationId).eq('user_id', user.id);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Evaluations API error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
