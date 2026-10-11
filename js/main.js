// 프로필 페이지 인터랙션 스크립트
(function () {
  'use strict';

  // ───── 모바일 메뉴 ─────

  function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');

    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    });

    // 메뉴 항목을 누르면 자동으로 닫힘
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ───── 스크롤 관련: 내비 배경, 맨 위로 버튼 ─────

  function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const toTop = document.getElementById('to-top');

    function onScroll() {
      navbar.classList.toggle('is-scrolled', window.scrollY > 20);

      const showTop = window.scrollY > 600;
      toTop.classList.toggle('opacity-0', !showTop);
      toTop.classList.toggle('translate-y-4', !showTop);
      toTop.classList.toggle('pointer-events-none', !showTop);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ───── 현재 섹션 내비게이션 하이라이트 ─────

  function initActiveNav() {
    const links = document.querySelectorAll('a.nav-link[href^="#"]');
    const sections = Array.from(links)
      .map(function (link) { return document.querySelector(link.getAttribute('href')); })
      .filter(Boolean);

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            const isActive = link.getAttribute('href') === '#' + entry.target.id;
            link.classList.toggle('is-active', isActive);
          });
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(function (section) { observer.observe(section); });
  }

  // ───── 스크롤 등장 애니메이션 ─────

  function initReveal() {
    const items = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          // 한 번 나타난 요소는 더 이상 관찰하지 않음
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    items.forEach(function (item) { observer.observe(item); });
  }

  // ───── 숙련도 바 채우기 ─────

  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.style.width = entry.target.dataset.level + '%';
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    bars.forEach(function (bar) { observer.observe(bar); });
  }

  // ───── 숫자 카운트업 (data-count 속성 사용) ─────

  function animateCount(el, target, duration) {
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * progress);
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(entry.target, Number(entry.target.dataset.count), 1200);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) { observer.observe(el); });
  }

  // ───── 푸터 연도 ─────

  function initYear() {
    document.getElementById('year').textContent = new Date().getFullYear();
  }

  // ───── DOM 준비 후 실행 ─────

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initScrollEffects();
    initActiveNav();
    initReveal();
    initSkillBars();
    initCountUp();
    initYear();
  });
})();
