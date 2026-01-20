import { SiGithub } from '@icons-pack/react-simple-icons'
import { Link } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'

const Footer = () => {
  return (
    <>
      <div className="border-y">
        <div className="max-w-7xl mx-auto border-x flex flex-col relative h-20">
          <PlusIcon className="absolute text-neutral-300 z-10 top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
          <PlusIcon className="absolute text-neutral-300 z-10 top-0 right-0 translate-x-1/2 -translate-y-1/2" />
          <PlusIcon className="absolute text-neutral-300 z-10 bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
          <PlusIcon className="absolute text-neutral-300 z-10 bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
        </div>
      </div>

      <footer className="border-t">
        <div className="max-w-7xl border-x px-8 mx-auto py-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Link to="/">flins</Link>
            <p className="text-muted-foreground text-sm">
              Universal skill and command manager for AI coding agents
            </p>
          </div>
          <a
            href="https://github.com/flinstech/flins"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiGithub />
          </a>
        </div>
      </footer>
    </>
  )
}

export default Footer
