import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
  message: string;
  'bot-field': string;
};

const App: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (data['bot-field']) {
      // Honeypot triggered
      console.log('Bot detected');
      reset();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        reset();
        setTimeout(() => setIsSubmitted(false), 4000);
      } else {
        const result = await response.json();
        throw new Error(result.error || 'Something went wrong');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container flex flex-col md:flex-row items-center justify-between pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2"
        >
          <h1>Your Name</h1>
          <p className="text-lg md:text-xl text-[#4a4a4a]">Full-Stack Developer & Designer</p>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="container section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>About Me</h2>
          <p>
            I'm a passionate developer who loves building clean, functional, and beautiful digital experiences.
            With a focus on user-centered design and robust code, I bring ideas to life across the full stack.
            Whether crafting interactive interfaces or architecting backend systems, I aim for simplicity and
            elegance in every project.
          </p>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section className="container section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
            hidden: {},
          }}
        >
          {[
            {
              title: 'E-Commerce Dashboard',
              description:
                'A full-stack admin dashboard with real-time analytics, order management, and inventory tracking.',
            },
            {
              title: 'Task Management App',
              description:
                'A collaborative to-do app with drag-and-drop interface, team assignments, and deadline tracking.',
            },
            {
              title: 'Portfolio Website',
              description:
                'A responsive personal website built with React and Tailwind, featuring animations and contact form.',
            },
          ].map((project, index) => (
            <motion.div
              key={index}
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 },
              }}
              transition={{ duration: 0.4 }}
              className="card"
            >
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="container section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </motion.h2>
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          {/* Honeypot field */}
          <div className="hidden">
            <input
              type="text"
              {...register('bot-field')}
              autoComplete="off"
              aria-label="Please leave this field empty"
            />
          </div>

          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows={5}
              placeholder="Tell me about your project..."
              {...register('message', { required: 'Message is required' })}
            />
            {errors.message && <p className="text-red-600 text-sm">{errors.message.message}</p>}
          </div>

          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {error && <p className="text-red-600 mt-4">Error: {error}</p>}
        </motion.form>
      </section>

      {/* Toast Notification */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            Message sent successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;