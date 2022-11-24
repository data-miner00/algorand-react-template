import React from "react";
import { motion } from "framer-motion";

export interface Props {
  title: string;
  description: string;
  url: string;
  delay: number;
}

function StackCard({ title, description, url, delay }: Props): JSX.Element {
  return (
    <motion.a
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
        delay: delay * 0.2,
      }}
      href={url}
      target="_blank"
      className="block p-6 w-80 group group-hover:shadow-md border border-solid border-gray-300 hover:border-gray-400 dark:border-gray-500 rounded dark:hover:border-gray-400"
    >
      <h4 className="font-bold text-lg">{title}</h4>
      <p className="my-3 text-gray-500 dark:text-gray-300">{description}</p>
      <button className="text-blue-400 dark:text-green-300 group-hover:underline hover:text-blue-300">
        Documentation →
      </button>
    </motion.a>
  );
}

export default StackCard;
