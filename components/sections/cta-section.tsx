'use client';

import { motion } from 'framer-motion';
import { Star, Github, Twitter, Instagram, Youtube, Globe, ExternalLink } from 'lucide-react';
import { ButtonPrimary } from '@/components/ui/button-primary';

const socialLinks: {
  name: string;
  handle: string;
  href: string;
  icon: typeof Github;
  color: string;
}[] = [
  // TODO: Add social links
];

export function CTASection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#1C1C1E] to-[#0C0C0E] text-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF9100]/20 text-[#FF9100] text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            הצטרפו אלינו
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            מוכנים להתחיל?
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            גלו את עולם התורה דרך סיפורים מרתקים ושאלות מעוררות מחשבה.
            הרשמו עכשיו וקבלו גישה לתוכן בלעדי.
          </p>

          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-[#1C1C1E] font-semibold text-lg hover:bg-white/90 transition-colors"
          >
            <Star className="w-5 h-5 text-[#FF9100]" />
            התחל ללמוד
          </motion.a>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-16" />

        {/* Connect Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            הישארו מעודכנים
          </h3>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            עקבו אחרינו לקבלת תוכן חדש, סיפורים ותובנות מעולם התורה
          </p>

          {/* Social Links Grid */}
          {socialLinks.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 hover:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all group"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${social.color}20` }}
                    >
                      <IconComponent
                        className="w-6 h-6"
                        style={{ color: social.color }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white/80 group-hover:text-white">
                      {social.name}
                    </span>
                    <span className="text-xs text-white/40">
                      {social.handle}
                    </span>
                  </motion.a>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
