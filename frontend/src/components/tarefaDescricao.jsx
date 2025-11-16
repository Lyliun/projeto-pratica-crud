import React, { useState, useEffect, useRef } from "react";

function TarefaDescricao({ tarefa, onClose, onToggleStatus }) {
  const [startY, setStartY] = useState(null);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const drawerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 640
  );

  // Atualiza quando a tarefa muda
  useEffect(() => {
    if (tarefa) {
      setIsClosing(false);
      setCurrentTranslate(0);
    }
  }, [tarefa]);

  // Detecta redimensionamento da tela
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // =============================
  // Eventos de arraste (mobile + desktop)
  // =============================

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !startY) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff < 0) return; // Só arrasta para baixo

    const resistance = 0.4;
    setCurrentTranslate(diff * resistance);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (currentTranslate > 150) {
      setIsClosing(true);
      setTimeout(onClose, 300);
    } else {
      setCurrentTranslate(0);
    }
  };

  const handleMouseDown = (e) => {
    setStartY(e.clientY);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !startY) return;

    const diff = e.clientY - startY;
    if (diff < 0) return;

    const resistance = 0.4;
    setCurrentTranslate(diff * resistance);
  };

  const handleMouseUp = () => handleTouchEnd();

  if (!tarefa) return null;

  return (
    <>
      {/* Fundo translúcido */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
        style={{
          opacity: isClosing ? 0 : 1,
          transition: "opacity 0.3s ease-out",
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{
          position: "fixed",
          bottom: 0,
          right: isMobile ? "0" : "0",
          width: isMobile ? "100%" : "24rem",
          top: isMobile ? "auto" : 0,
          background: "#1e293b",
          color: "#e2e8f0",
          boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
          transform: isDragging
            ? `translateY(${currentTranslate}px)`
            : isClosing
            ? isMobile
              ? "translateY(100%)"
              : "translateX(100%)"
            : "translate(0)",
          height: isMobile ? "80vh" : "100%",
          borderTopLeftRadius: isMobile ? "20px" : "0",
          borderTopRightRadius: isMobile ? "20px" : "0",
          transition: "transform 0.3s ease-out",
          zIndex: 50,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Área arrastável */}
        <div
          style={{
            height: "2rem",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "grab",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            style={{
              width: "3rem",
              height: "0.375rem",
              background: "#475569",
              borderRadius: "9999px",
            }}
          />
        </div>

        {/* Conteúdo */}
        <div
          style={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 2rem)",
            overflowY: "auto",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#e2e8f0",
              marginBottom: "0.75rem",
            }}
          >
            {tarefa.titulo}
          </h2>

          <div
            style={{
              marginBottom: "1rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                width: "0.75rem",
                height: "0.75rem",
                borderRadius: "9999px",
                display: "inline-block",
                background: tarefa.concluida ? "#10b981" : "#f59e0b",
              }}
            />
            <span style={{ color: "#94a3b8" }}>
              {tarefa.concluida ? "Concluída" : "Pendente"}
            </span>
          </div>

          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.5rem",
              }}
            >
              Descrição
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              {tarefa.descricao || "Sem descrição adicionada"}
            </p>
          </div>

          {/* Botão de alternar status */}
          <button
            onClick={() => onToggleStatus && onToggleStatus(tarefa.id)}
            style={{
              marginTop: "1.5rem",
              width: "100%",
              background: tarefa.concluida
                ? "rgba(16, 185, 129, 0.15)"
                : "rgba(245, 158, 11, 0.15)",
              color: tarefa.concluida ? "#10b981" : "#f59e0b",
              padding: "0.75rem",
              borderRadius: "0.75rem",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            {tarefa.concluida ? "Marcar como Pendente" : "Marcar como Concluída"}
          </button>

          <button
            onClick={onClose}
            style={{
              marginTop: "1rem",
              width: "100%",
              background: "rgba(239, 68, 68, 0.07)",
              color: "#f87171",
              padding: "0.75rem",
              borderRadius: "0.75rem",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </>
  );
}

export default TarefaDescricao;