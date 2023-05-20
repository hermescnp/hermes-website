"use client"
import Image from 'next/image'
import dynamic from 'next/dynamic'

const Experience = dynamic(() => import('../components/Experience/Experience'), {
  ssr: false,
  loading: () => <p>loading...</p>
});

export default function Home() {
  return (
    <div>
      <Experience />
    </div>
  )
}
