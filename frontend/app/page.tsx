"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function FirstSection() {
  return (
    <div className="flex md:p-20 sm:p-10 p-5 min-h-screen dark:bg-gray-950 bg-gray-50">
      <motion.div
        className="md:flex-1 md:flex md:items-center md:justify-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/img/undraw_messages_bpqv.svg"
          alt="Welcome Image"
          className="max-md:hidden"
          width={800}
          height={800}
        />
      </motion.div>

      <motion.div
        className="flex-1 flex items-center justify-center md:flex-row flex-col"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="space-y-5 md:space-y-3">
          <motion.h1
            className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl md:text-right text-left"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            The Joke Tax <span className="font-playfair">Chronicles</span>
          </motion.h1>

          <motion.p
            className="text-primary md:text-right text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed voluptatibus laudantium culpa saepe, reprehenderit repellat expedita commodi. Similique velit ipsa vel cupiditate nesciunt, quidem sunt obcaecati labore facilis, fuga nobis?
          </motion.p>

          <motion.div
            className="flex justify-end space-x-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button><Link href="/messages">
              Get Started</Link></Button>
            <Button variant="outline"><span>Learn More</span> <ArrowRight /></Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Home() {
  return (
    <section>
      {/* get started itp */}
      <FirstSection />
    </section>
  );
}
