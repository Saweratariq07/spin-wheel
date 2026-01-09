/// <reference types="vite/client" />
import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

interface Prize {
  id?: number;
  label: string;
  color?: string;
  probability?: number;
  value?: number;
}

const prizes: Prize[] = [
  { id: 1, label: '10% OFF', color: '#FF6B6B', probability: 20 },
  { id: 2, label: 'Free Shipping', color: '#4ECDC4', probability: 15 },
  { id: 3, label: '15% OFF', color: '#FFD93D', probability: 15 },
  { id: 4, label: 'Try Again', color: '#95E1D3', probability: 25 },
  { id: 5, label: '20% OFF', color: '#F38181', probability: 10 },
  { id: 6, label: '$5 OFF', color: '#AA96DA', probability: 10 },
  { id: 7, label: 'Try Again', color: '#FCBAD3', probability: 5 },
  { id: 8, label: '25% OFF', color: '#A8E6CF', probability: 0 },
];

export function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const segmentAngle = 360 / prizes.length;

  const validateEmail = (value: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return false;
    const domain = value.split('@')[1]?.toLowerCase();
    return domain === 'gmail.com' || domain === 'googlemail.com';
  };

   const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
   //campain id 
   const CAMPAIGN_ID = import.meta.env.VITE_CAMPAIGN_ID || '';

 const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // keep spin animation local, but let backend decide the prize on claim
    const randomRotation = 360 * 5 + Math.random() * 360;
    setRotation((r) => r + randomRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setShowEmailModal(true);
    }, 4000);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid Gmail address');
      return;
    }

    setEmailError('');
    setShowEmailModal(false);

    if (!CAMPAIGN_ID) {
      toast.error('Campaign ID not configured. Add VITE_CAMPAIGN_ID to .env file');
      setShowEmailModal(true);
      return;
    }

    try {
      const resp = await fetch(`${BACKEND_URL}/api/spin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, campaignId: CAMPAIGN_ID }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || 'Server error');
      }

      const data = await resp.json();

      // Backend determines the prize; show it in the UI but do NOT display code
      setWonPrize({ label: data.prizeWon || 'Try Again', value: data.prizeValue });
      setShowResultModal(true);

      if ((data.prizeWon || '').toLowerCase() !== 'try again') {
        toast.success('Prize claimed — check your Gmail for the code.');
      } else {
        toast.success('Result recorded — check your Gmail for offers.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to claim prize. Please try again.');
      setShowEmailModal(true);
    }
  };

  const handleCloseResult = () => {
    setShowResultModal(false);
    setEmail('');
    setWonPrize(null);
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">Spin & Win!</h1>
            <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-white/90 text-lg sm:text-xl">Try your luck and win amazing prizes!</p>
          <p className="text-white/70 text-sm sm:text-base mt-2">Enter your email after spinning to claim your reward</p>
        </div>

        <div className="relative flex items-center justify-center mb-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 drop-shadow-2xl">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-30 border-t-white" />
          </div>

          <div className="relative w-75 sm:w-[400px] md:w-125 lg:w-[600px] aspect-square">
            <motion.div
              // ref={wheelRef}
              className="w-full h-full rounded-full relative overflow-hidden shadow-2xl"
              style={{ background: '#fff' }}
              animate={{ rotate: rotation }}
              transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }}
            >
               {prizes.map((prize, index) => {
                const angle = index * segmentAngle;
                return (
                  <div
                    key={prize.label + index}
                    className="absolute w-full h-full top-0 left-0"
                    style={{ transform: `rotate(${angle}deg)`, transformOrigin: '50% 50%' }}
                  >
                    <div
                      className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
                      style={{
                        background: `linear-gradient(135deg, ${prize.color} 0%, ${prize.color}dd 100%)`,
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                        transform: `rotate(${segmentAngle}deg) skewY(${90 - segmentAngle}deg)`,
                      }}
                    />
                    <div
                      className="absolute top-[25%] left-[55%] -translate-x-1/2"
                      style={{ transform: `translate(-50%, 0) rotate(${segmentAngle / 2}deg)`, width: '45%' }}
                    >
                      <p className="text-white text-center font-bold text-sm sm:text-base md:text-lg drop-shadow-md whitespace-nowrap">
                        {prize.label}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 sm:w-24 md:w-28 lg:w-32 h-20 sm:h-24 md:h-28 lg:h-32 rounded-full bg-white shadow-lg border-4 border-purple-600 flex items-center justify-center">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={handleSpin}
            disabled={isSpinning}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-xl px-12 py-6 rounded-full shadow-2xl transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
          </Button>
        </div>
      </div>

      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Claim Your Prize!</DialogTitle>
            <DialogDescription>Enter your email address to receive your reward</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="font-bold">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                className="mt-2"
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>
            <Button type="submit" className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Claim Reward
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showResultModal} onOpenChange={handleCloseResult}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {wonPrize?.label === 'Try Again' ? 'Better Luck Next Time!' : 'Congratulations! 🎉'}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            {wonPrize?.label === 'Try Again' ? (
              <div>
                <p className="text-lg mb-4">Don't worry, come back tomorrow for another chance!</p>
                <p className="text-gray-600">We've sent you a special offer via email.</p>
              </div>
            ) : (
              <div>
                <p className="text-xl mb-2">You've won</p>
                <p className="text-4xl font-bold text-purple-600 mb-4">{wonPrize?.label}</p>
                {/* <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Your discount code:</p>
                  <p className="text-2xl font-bold text-purple-600 tracking-wider">{discountCode}</p>
                </div> */}
                <p className="text-sm text-gray-600">
                  We've sent this code to <strong>{email}</strong>
                </p>
              </div>
            )}
          </div>
          <Button onClick={handleCloseResult} className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
