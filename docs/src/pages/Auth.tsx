import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth';
import { SignUpForm } from '@/components/auth';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Auth = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  const handleSuccess = () => {
    // Redirect to projects hub on successful auth
    navigate('/projects', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-4 left-4"
      >
        <Button variant="ghost" size="icon" onClick={() => navigate('/', { replace: true })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 gradient-text">AlaweinOS</h1>
          <p className="text-muted-foreground">
            Unified platform for scientific computing and AI research
          </p>
        </div>

        <Card className="border-blue-500/20">
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as 'login' | 'signup')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="login" className="mt-0">
                <LoginForm onSuccess={handleSuccess} />
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <SignUpForm onSuccess={handleSuccess} />
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          Secure authentication powered by Supabase
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Auth;
