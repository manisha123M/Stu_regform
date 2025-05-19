import React, { useEffect, useRef } from 'react';

function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const numCircles = 50;
    const colors = [
      'rgba(255, 255, 150, 0.22)',
      'rgba(255, 230, 100, 0.22)',
      'rgba(255, 200, 50, 0.22)',
    ];

    let circles = [];

    const createCircle = (x, y, radius, color) => ({
      x,
      y,
      radius,
      color,
      opacity: 0,
      fadeSpeed: 0.05,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
    });

    const initCircles = () => {
      circles = [];
      for (let i = 0; i < numCircles; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 60 + 20;
        const color = colors[i % colors.length];
        circles.push(createCircle(x, y, radius, color));
      }
    };

    const drawCircles = () => {
      ctx.clearRect(0, 0, width, height);
      circles.forEach((circle) => {
        if (circle.opacity < 1) {
          circle.opacity += circle.fadeSpeed;
        }

        const gradient = ctx.createRadialGradient(
          circle.x, circle.y, 0,
          circle.x, circle.y, circle.radius
        );
        const colorWithOpacity = circle.color.replace(/, \d(\.\d+)?\)$/, `, ${circle.opacity})`);
        gradient.addColorStop(0, colorWithOpacity);
        gradient.addColorStop(1, circle.color.replace(/, \d(\.\d+)?\)$/, ', 0)'));

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 25;
        ctx.shadowColor = colorWithOpacity;
        ctx.fill();
        ctx.closePath();
      });
    };

    const updateCircles = () => {
      circles.forEach((circle) => {
        circle.x += circle.vx;
        circle.y += circle.vy;

        if (circle.x + circle.radius > width || circle.x - circle.radius < 0) {
          circle.vx *= -1;
        }
        if (circle.y + circle.radius > height || circle.y - circle.radius < 0) {
          circle.vy *= -1;
        }
      });
    };

    const animate = () => {
      drawCircles();
      updateCircles();
      requestAnimationFrame(animate);
    };

    initCircles();
    animate();

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleInteraction = () => {
      circles.forEach((circle) => {
        const dx = mouseX - circle.x;
        const dy = mouseY - circle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 5;
          circle.x -= (dx / distance) * force;
          circle.y -= (dy / distance) * force;
        }
      });
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initCircles();
    };

    const interactionInterval = setInterval(handleInteraction, 20);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interactionInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
   <canvas
  ref={canvasRef}
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 0, 
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  }}
/>

  );
}
export default AnimatedBackground;
