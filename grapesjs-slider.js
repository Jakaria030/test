import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";

function App() {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = grapesjs.init({
      container: editorRef.current,
      height: "100vh",
      storageManager: false,
    });

    /* ---------------- SLIDE COMPONENT ---------------- */
    editor.DomComponents.addType("slide", {
      model: {
        defaults: {
          tagName: "div",
          classes: ["slide"],
          droppable: true,
          draggable: false,
          content: "Slide content",
        },
      },
    });

    /* ---------------- SLIDER COMPONENT ---------------- */
    editor.DomComponents.addType("slider", {
      isComponent: (el) =>
        el.classList?.contains("slider") ? { type: "slider" } : false,

      model: {
        defaults: {
          tagName: "div",
          classes: ["slider"],

          currentSlide: 0,

          sliderConfig: {
            slides: 3,
            arrows: true,
            autoplay: true,
            delay: 3000,
          },

          components: [],
        },

        init() {
          this.listenTo(this, "change:sliderConfig", this.updateSlides);
          this.updateSlides();
        },

        updateSlides() {
          const config = this.get("sliderConfig");

          const slides = [];
          for (let i = 0; i < config.slides; i++) {
            slides.push({
              type: "slide",
              content: `Slide ${i + 1}`,
            });
          }

          this.components().reset(slides);
        },
      },

      view: {
        events: {
          "click .next": "nextSlide",
          "click .prev": "prevSlide",
          mouseenter: "stopAutoplay",
          mouseleave: "startAutoplay",
        },

        onRender() {
          this.buildStructure();
          this.updateSlide();
          this.startAutoplay();
        },

        onRemove() {
          this.stopAutoplay();
        },

        /* ---------------- BUILD HTML WRAPPER ---------------- */
        buildStructure() {
          const el = this.el;
          if (!el) return;

          let inner = el.querySelector(".slider-inner");

          if (!inner) {
            inner = document.createElement("div");
            inner.className = "slider-inner";

            // Move all children into inner wrapper
            while (el.firstChild) {
              inner.appendChild(el.firstChild);
            }

            el.appendChild(inner);
          }

          const config = this.model.get("sliderConfig");

          // Add arrows
          if (config.arrows && !el.querySelector(".next")) {
            const prev = document.createElement("button");
            prev.className = "prev";
            prev.innerText = "Prev";

            const next = document.createElement("button");
            next.className = "next";
            next.innerText = "Next";

            el.appendChild(prev);
            el.appendChild(next);
          }
        },

        /* ---------------- SLIDE CONTROL ---------------- */
        updateSlide() {
          const inner = this.el.querySelector(".slider-inner");
          if (!inner) return;

          const current = this.model.get("currentSlide") || 0;

          inner.style.transform = `translateX(-${current * 100}%)`;
          inner.style.transition = "0.5s";
        },

        nextSlide() {
          const model = this.model;
          const config = model.get("sliderConfig");

          let current = model.get("currentSlide") || 0;
          const total = model.components().length;

          current = current >= total - 1 ? 0 : current + 1;

          model.set("currentSlide", current);
          this.updateSlide();
        },

        prevSlide() {
          const model = this.model;

          let current = model.get("currentSlide") || 0;
          const total = model.components().length;

          current = current <= 0 ? total - 1 : current - 1;

          model.set("currentSlide", current);
          this.updateSlide();
        },

        /* ---------------- AUTOPLAY ---------------- */
        startAutoplay() {
          const model = this.model;
          const config = model.get("sliderConfig");

          if (!config.autoplay) return;
          if (this.interval) return;

          this.interval = setInterval(() => {
            this.nextSlide();
          }, config.delay);
        },

        stopAutoplay() {
          if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
          }
        },
      },
    });

    /* ---------------- BLOCK ---------------- */
    editor.BlockManager.add("slider-block", {
      label: "Slider",
      category: "Components",
      content: { type: "slider" },
    });


    /* ---------------- BASIC STYLES ---------------- */
    editor.addStyle(`
      .slider {
        position: relative;
        overflow: hidden;
        width: 100%;
      }

      .slider-inner {
        display: flex;
      }

      .slide {
        min-width: 100%;
        flex-shrink: 0;
        padding: 20px;
        background: #eee;
        text-align: center;
      }

      .prev, .next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        background: black;
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
      }

      .prev { left: 10px; }
      .next { right: 10px; }
    `);
  }, []);

  return <div ref={editorRef} />;
}

export default App;
