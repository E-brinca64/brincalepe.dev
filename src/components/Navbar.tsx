'use client'

import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'

export type NavbarLabels = {
  about: string
  projects: string
  arsenal: string
  now: string
  contact: string
  openTerminal: string
  switchLanguage: string
  closeMenu: string
  openMenu: string
}

type NavbarProps = {
  language: 'en' | 'pt'
  labels: NavbarLabels
  onToggleLanguage: () => void
  onBrandActivate: () => void
}

const SECTION_IDS = ['about', 'arsenal', 'projects', 'now', 'contact'] as const

const linksFor = (labels: NavbarLabels) => [
  [labels.about, '#about'],
  [labels.arsenal, '#arsenal'],
  [labels.projects, '#projects'],
  [labels.now, '#now'],
  [labels.contact, '#contact'],
] as const

function MenuIcon({ close = false }: { close?: boolean }) {
  return close ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="m18 6-12 12M6 6l12 12" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function Navbar({ language, labels, onToggleLanguage, onBrandActivate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const links = linksFor(labels)

  useEffect(() => {
    const elements = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const updateBottomSection = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24

      if (nearBottom) {
        setActiveSection(SECTION_IDS[SECTION_IDS.length - 1])
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id)
        } else {
          updateBottomSection()
        }
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0,
      }
    )

    elements.forEach((el) => observer.observe(el))
    window.addEventListener('scroll', updateBottomSection, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateBottomSection)
    }
  }, [])

  const activateBrand = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onBrandActivate()
  }

  return (
    <header className="topbar">
      <a className="brand" href="#top" onClick={activateBrand} aria-label={labels.openTerminal}>
        <span className="brand-mark">EB<span className="!text-[#d9a442]">.</span></span>
        <span className="brand-name">
          ENZO BRINCALEPE
          <small>PERSONAL WORKSPACE</small>
        </span>
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? labels.closeMenu : labels.openMenu}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <MenuIcon close={menuOpen} />
      </button>

      <nav
        id="main-navigation"
        className={menuOpen ? 'nav-links nav-open' : 'nav-links'}
        aria-label="Main navigation"
      >
        {links.map(([label, href]) => {
          const sectionId = href.replace('#', '')
          const isActive = activeSection === sectionId

          return (
            <a
              key={href}
              href={href}
              className={isActive ? 'active !text-[#d9a442]' : undefined}
              aria-current={isActive ? 'location' : undefined}
              onClick={() => {
                setActiveSection(sectionId)
                setMenuOpen(false)
              }}
            >
              {label}
            </a>
          )
        })}
      </nav>

      <div className="navbar-controls">
        <button
          className="language-toggle"
          type="button"
          onClick={onToggleLanguage}
          aria-label={labels.switchLanguage}
        >
          <span className={language === 'en' ? 'active text-[#d9a442] font-semibold' : 'text-zinc-500'}>EN</span>
          <i aria-hidden="true">|</i>
          <span className={language === 'pt' ? 'active text-[#d9a442] font-semibold' : 'text-zinc-500'}>PT</span>
        </button>
      </div>
    </header>
  )
}