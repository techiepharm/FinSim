
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from './useSupabaseAuth';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  date_of_birth?: string;
  bvn?: string;
  nin?: string;
  address?: string;
}

interface UserPortfolio {
  id: string;
  user_id: string;
  cash_balance: number;
  locked_savings: number;
  total_investments: number;
}

interface UserCreditScore {
  id: string;
  user_id: string;
  credit_score: number;
  score_date: string;
  payment_history_score: number;
  credit_utilization_score: number;
  length_of_credit_score: number;
  credit_mix_score: number;
  new_credit_score: number;
  factors_affecting_score?: any;
}

export const useUserData = () => {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [creditScore, setCreditScore] = useState<UserCreditScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData);
        }

        // Fetch user portfolio
        const { data: portfolioData, error: portfolioError } = await supabase
          .from('user_portfolios')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (portfolioError && portfolioError.code !== 'PGRST116') {
          console.error('Error fetching portfolio:', portfolioError);
        } else {
          setPortfolio(portfolioData);
        }

        // Fetch credit score
        const { data: creditData, error: creditError } = await supabase
          .from('user_credit_scores')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (creditError && creditError.code !== 'PGRST116') {
          console.error('Error fetching credit score:', creditError);
        } else {
          setCreditScore(creditData);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, isAuthenticated]);

  const updatePortfolio = async (updates: Partial<UserPortfolio>) => {
    if (!user || !portfolio) return;

    try {
      const { data, error } = await supabase
        .from('user_portfolios')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setPortfolio(data);
      return data;
    } catch (error) {
      console.error('Error updating portfolio:', error);
      throw error;
    }
  };

  const addTransaction = async (transaction: {
    transaction_type: string;
    amount: number;
    description?: string;
    symbol?: string;
    quantity?: number;
    tax_amount?: number;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_transactions')
        .insert({
          user_id: user.id,
          ...transaction
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  return {
    profile,
    portfolio,
    creditScore,
    loading,
    updatePortfolio,
    addTransaction
  };
};
