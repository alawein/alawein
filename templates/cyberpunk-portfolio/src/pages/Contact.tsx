import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Terminal } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("sent");
    
    // Reset after 3 seconds
    setTimeout(() => {
      setStatus("idle");
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <div className="container py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="font-mono text-sm text-cyber-neon/60 mb-2">
          <span className="text-cyber-pink">$</span> ./contact --init
        </div>
        <h1 className="text-4xl md:text-5xl font-cyber font-bold text-white">
          <span className="text-cyber-neon">[</span>CONTACT<span className="text-cyber-neon">]</span>
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          Have a project in mind? Let's build something amazing together.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="cyber-border bg-cyber-dark/50 backdrop-blur-sm p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-mono text-sm text-cyber-neon/60 mb-2">
                NAME_
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-cyber-darker border border-cyber-neon/30 text-white font-mono focus:border-cyber-neon focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,159,0.3)] transition-all"
                placeholder="Enter your name..."
                required
              />
            </div>

            <div>
              <label className="block font-mono text-sm text-cyber-neon/60 mb-2">
                EMAIL_
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-cyber-darker border border-cyber-neon/30 text-white font-mono focus:border-cyber-neon focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,159,0.3)] transition-all"
                placeholder="Enter your email..."
                required
              />
            </div>

            <div>
              <label className="block font-mono text-sm text-cyber-neon/60 mb-2">
                MESSAGE_
              </label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-cyber-darker border border-cyber-neon/30 text-white font-mono focus:border-cyber-neon focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,159,0.3)] transition-all resize-none"
                placeholder="Enter your message..."
                required
              />
            </div>

            <CyberButton type="submit" className="w-full" disabled={status === "sending"}>
              {status === "idle" && (
                <>TRANSMIT <Send className="ml-2 h-4 w-4" /></>
              )}
              {status === "sending" && "TRANSMITTING..."}
              {status === "sent" && "✓ MESSAGE SENT"}
              {status === "error" && "✗ TRANSMISSION FAILED"}
            </CyberButton>
          </form>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Terminal */}
          <div className="cyber-border bg-cyber-darker p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-cyber-neon/20">
              <Terminal className="h-4 w-4 text-cyber-neon" />
              <span className="text-muted-foreground">contact_info.sh</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-cyber-pink" />
                <a href="mailto:hello@alawein.dev" className="text-cyber-neon hover:underline">
                  hello@alawein.dev
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-cyber-blue" />
                <span className="text-muted-foreground">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Response time */}
          <div className="cyber-border bg-cyber-dark/50 backdrop-blur-sm p-6 text-center">
            <div className="font-cyber text-3xl text-cyber-neon neon-text mb-2">
              &lt; 24H
            </div>
            <div className="font-mono text-sm text-muted-foreground">
              AVERAGE RESPONSE TIME
            </div>
          </div>

          {/* Status */}
          <div className="cyber-border bg-cyber-dark/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-cyber-neon animate-pulse" />
              <span className="font-mono text-sm text-cyber-neon">
                AVAILABLE FOR NEW PROJECTS
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

