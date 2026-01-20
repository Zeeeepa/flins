import { SiDiscord, SiGithub } from '@icons-pack/react-simple-icons'
import { Link } from '@tanstack/react-router'
import SectionDivider from './section-divider'
import { Button } from './ui/button'
import logo from '../logo.svg'
import { ArrowUpRightIcon } from 'lucide-react'

const Header = () => {
  return (
    <>
      <header className="border-b">
        <div className="max-w-7xl border-x px-8 mx-auto h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl">
            <img className="size-6" src={logo} alt="flins logo" />
            flins
          </Link>
          <div className="flex items-center">
            <Button variant="ghost" render={<Link to="/directory" />}>
              Directory
            </Button>
            <Button
              variant="ghost"
              render={
                <a
                  href="https://github.com/flinstech/flins?tab=readme-ov-file#flins"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Docs
              <ArrowUpRightIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-xl"
              render={
                <a
                  href="https://discord.gg/a8dEPa7eNs"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <SiDiscord />
            </Button>
            <Button
              variant="ghost"
              size="icon-xl"
              render={
                <a
                  href="https://github.com/flinstech/flins"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <SiGithub />
            </Button>
          </div>
        </div>
      </header>

      <SectionDivider />
    </>
  )
}

export default Header
