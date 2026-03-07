'use client';

import { motion } from 'framer-motion';

export default function SupportPage() {
    return (
        <motion.div
            className="support-page"
            style={{ padding: 'var(--spacing-xl)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="page-title">Support</h1>
            <p>For technical assistance, please contact the network operations center.</p>
        </motion.div>
    );
}
