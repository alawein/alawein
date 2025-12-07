import { motion } from "framer-motion";
import { Mail, MapPin, Send, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" },
  { icon: MapPin, label: "Location", value: "San Francisco, CA", href: "#" },
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
];

export default function Contact() {
  return (
    <div className="container pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">Get In Touch</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Have a project in mind or just want to chat? Feel free to reach out!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <h2 className="text-xl font-semibold mb-6">Send a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-muted/50 border border-white/10 rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-muted/50 border border-white/10 rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-muted/50 border border-white/10 rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 bg-muted/50 border border-white/10 rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Send Message <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Info Cards */}
            {contactInfo.map((info) => (
              <a
                key={info.label}
                href={info.href}
                className="glass-card p-6 flex items-center gap-4 hover-card block"
              >
                <div className="p-3 rounded-lg bg-primary/10">
                  <info.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{info.label}</p>
                  <p className="font-medium">{info.value}</p>
                </div>
              </a>
            ))}

            {/* Social Links */}
            <div className="glass-card p-6">
              <h3 className="font-medium mb-4">Connect with me</h3>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-lg bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <link.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-3 h-3 rounded-full bg-green-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-muted-foreground">
                  Currently available for freelance work
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

