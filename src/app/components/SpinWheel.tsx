/// <reference types="vite/client" />
import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";

interface Prize {
  label: string;
  color?: string;
  value?: number;
}

// Dummy prizes
const prizes: Prize[] = [
  { label: "10% OFF", color: "#FF6B6B", value: 10 },
  { label: "Free Shipping", color: "#4ECDC4", value: 0 },
  { label: "15% OFF", color: "#FFD93D", value: 15 },
  { label: "Try Again", color: "#95E1D3", value: 0 },
  { label: "20% OFF", color: "#F38181", value: 20 },
  { label: "$5 OFF", color: "#AA96DA", value: 5 },
  { label: "25% OFF", color: "#A8E6CF", value: 25 },
];

export function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isLoadingOTP, setIsLoadingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const segmentAngle = 360 / prizes.length;
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const validateEmail = (value: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return false;
    const domain = value.split("@")[1]?.toLowerCase();
    return domain === "gmail.com" || domain === "googlemail.com";
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
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
      setEmailError("Please enter a valid Gmail address");
      return;
    }
    setEmailError("");
    setIsLoadingOTP(true);
    try {
      const resp = await fetch(`${BACKEND_URL}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!resp.ok)
        throw new Error(
          (await resp.json()).message || "Failed to send OTP"
        );
      toast.success("OTP sent to your email!");
      setShowEmailModal(false);
      setShowOTPModal(true);
      setOtp("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoadingOTP(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }
    setOtpError("");
    setIsVerifyingOTP(true);
    try {
      const resp = await fetch(`${BACKEND_URL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      if (!resp.ok)
        throw new Error((await resp.json()).message || "Invalid OTP");
      toast.success("OTP verified! Claiming your prize...");
      await claimPrize();
    } catch (err) {
      console.error(err);
      setOtpError("Invalid OTP. Please try again.");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const claimPrize = async () => {
    try {
      const resp = await fetch(`${BACKEND_URL}/api/spin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // only email, no DB check
      });
      if (!resp.ok)
        throw new Error((await resp.json()).message || "Server error");
      const data = await resp.json();
      setWonPrize({
        label: data.prizeWon || "Try Again",
        value: data.prizeValue,
        color: prizes.find((p) => p.label === data.prizeWon)?.color,
      });
      setDiscountCode(data.discountCode || "");
      setShowOTPModal(false);
      setShowResultModal(true);
      if ((data.prizeWon || "").toLowerCase() !== "try again")
        toast.success("Prize claimed!");
      else toast.success("Result recorded! Better luck next time.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to claim prize.");
      setShowOTPModal(true);
    }
  };

  const handleCloseResult = () => {
    setShowResultModal(false);
    setEmail("");
    setOtp("");
    setWonPrize(null);
    setDiscountCode("");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      {/* Header */}
      <div className="max-w-2xl w-full text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
            Spin & Win!
          </h1>
          <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
        </div>
        <p className="text-white/90 text-lg sm:text-xl">
          Try your luck and win amazing prizes!
        </p>
        <p className="text-white/70 text-sm sm:text-base mt-2">
          Enter your email after spinning to claim your reward
        </p>
      </div>

      {/* Wheel */}
      <div className="relative flex items-center justify-center mb-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 drop-shadow-2xl">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-30 border-t-white" />
        </div>
        <div className="relative w-75 sm:w-[400px] md:w-125 lg:w-[600px] aspect-square">
          <motion.div
            className="w-full h-full rounded-full relative overflow-hidden shadow-2xl"
            style={{ background: "#fff" }}
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {prizes.map((prize, index) => {
              const angle = index * segmentAngle;
              return (
                <div
                  key={prize.label + index}
                  className="absolute w-full h-full top-0 left-0"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: "50% 50%",
                  }}
                >
                  <div
                    className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
                    style={{
                      background: `linear-gradient(135deg, ${prize.color} 0%, ${prize.color}dd 100%)`,
                      clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                      transform: `rotate(${segmentAngle}deg) skewY(${
                        90 - segmentAngle
                      }deg)`,
                    }}
                  />
                  <div
                    className="absolute top-[25%] left-[55%] -translate-x-1/2"
                    style={{
                      transform: `translate(-50%, 0) rotate(${
                        segmentAngle / 2
                      }deg)`,
                      width: "45%",
                    }}
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

      {/* Spin Button */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={handleSpin}
          disabled={isSpinning}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-xl px-12 py-6 rounded-full shadow-2xl transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSpinning ? "Spinning..." : "Spin the Wheel!"}
        </Button>
      </div>

      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Your Email</DialogTitle>
            <DialogDescription>
              We'll send you an OTP to verify your email
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="font-bold">
                Gmail Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                className="mt-2"
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoadingOTP}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoadingOTP ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* OTP Modal */}
      <Dialog open={showOTPModal} onOpenChange={setShowOTPModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
            <DialogDescription>
              Enter the 6-digit OTP sent to {email}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div>
              <Label htmlFor="otp" className="font-bold">
                OTP Code
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  setOtpError("");
                }}
                className="mt-2 text-center text-2xl tracking-widest font-bold"
              />
              {otpError && (
                <p className="text-red-500 text-sm mt-1">{otpError}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isVerifyingOTP || otp.length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isVerifyingOTP ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Result Modal */}
      <Dialog open={showResultModal} onOpenChange={handleCloseResult}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {wonPrize?.label === "Try Again"
                ? "Better Luck Next Time!"
                : "Congratulations! 🎉"}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            {wonPrize?.label === "Try Again" ? (
              <div>
                <p className="text-lg mb-4">
                  Don't worry, come back tomorrow for another chance!
                </p>
                <p className="text-gray-600">
                  We've sent you a special offer via email.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xl mb-2">You've won</p>
                <p className="text-4xl font-bold text-purple-600 mb-4">
                  {wonPrize?.label}
                </p>
                {discountCode && (
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Your discount code:
                    </p>
                    <p className="text-2xl font-bold text-purple-600 tracking-wider">
                      {discountCode}
                    </p>
                  </div>
                )}
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
