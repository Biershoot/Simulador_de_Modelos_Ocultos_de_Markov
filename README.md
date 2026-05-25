# 🔮 Simulador de Modelo Oculto de Markov (HMM)

## Condición Económica en el Sector Bancario

**Autor:** Alejandro Arango Calderón  
**Materia:** Procesos Estocásticos — Módulo 2, Actividad Didáctica 2  
**Fecha:** 2026

---

## 📋 Descripción

Simulador interactivo de un **Modelo Oculto de Markov (HMM)** aplicado a la inferencia de condiciones económicas en el sector bancario. El modelo utiliza observaciones indirectas del comportamiento en sucursales bancarias para inferir el estado económico real (no observable directamente).

### Escenario

| Componente | Detalle |
|---|---|
| **Estados Ocultos** | Expansión, Estable, Recesión |
| **Observaciones** | Flujo Alto de Clientes, Flujo Normal, Flujo Bajo, Retiros Masivos |
| **Algoritmos** | Forward (probabilidad de observaciones), Viterbi (inferencia de estados ocultos) |
| **Simulación** | Monte Carlo con múltiples réplicas |

### ¿Por qué un HMM?

En una sucursal bancaria, los empleados **no pueden observar directamente** la condición económica del país (expansión, estabilidad o recesión). Solo pueden ver **indicadores indirectos**: el flujo de clientes, el tipo de transacciones y la frecuencia de retiros. Un HMM modela exactamente esta situación: estados internos no observables que generan señales observables.

---

## 🚀 Instrucciones de Ejecución

### Requisitos
- Un navegador web moderno (Chrome, Firefox, Edge, Safari)
- No se requiere servidor, base de datos ni instalación de dependencias

### Ejecución
1. Clonar este repositorio:
   ```bash
   git clone https://github.com/[tu-usuario]/hmm-simulador-bancario.git
   ```
2. Abrir el archivo `hmm_simulator.html` en un navegador web:
   ```bash
   # En Windows
   start hmm_simulator.html

   # En macOS
   open hmm_simulator.html

   # En Linux
   xdg-open hmm_simulator.html
   ```
3. La simulación se ejecuta completamente en el navegador, sin necesidad de conexión a internet (excepto para cargar la fuente Google Fonts en la primera carga).

---

## 📁 Estructura del Proyecto

```
├── hmm_simulator.html     # Aplicación principal (HTML + CSS + JavaScript)
├── README.md              # Este archivo
└── simulacion_bancaria.html # (Referencia) Simulación M/M/1 anterior
```

### Descripción de Archivos

| Archivo | Descripción |
|---|---|
| `hmm_simulator.html` | Aplicación web autocontenida con el simulador HMM completo |
| `README.md` | Documentación del proyecto, instrucciones y estructura |

---

## 🧮 Componentes del Modelo

### Distribución Inicial (π)
```
π = [0.3, 0.5, 0.2]
```
- P(Expansión) = 0.3
- P(Estable) = 0.5
- P(Recesión) = 0.2

### Matriz de Transición (A)
```
              Expansión   Estable   Recesión
Expansión       0.60       0.30       0.10
Estable         0.20       0.60       0.20
Recesión        0.10       0.30       0.60
```

### Matriz de Emisión (B)
```
              Flujo Alto   Flujo Normal   Flujo Bajo   Retiros Masivos
Expansión       0.50          0.30          0.10            0.10
Estable         0.20          0.50          0.20            0.10
Recesión        0.05          0.15          0.30            0.50
```

---

## 🔬 Algoritmos Implementados

### 1. Simulación Monte Carlo
Genera secuencias de estados ocultos y observaciones a partir de los parámetros del modelo, permitiendo validar los algoritmos de inferencia.

### 2. Algoritmo Forward
Calcula la probabilidad de una secuencia de observaciones dado el modelo: **P(O|λ)**. Utiliza la recursión α para propagar probabilidades a través del tiempo.

### 3. Algoritmo de Viterbi
Encuentra la secuencia de estados ocultos más probable dada una secuencia de observaciones. Utiliza programación dinámica para encontrar el camino óptimo.

### 4. Distribución Estacionaria
Calcula la distribución de equilibrio a largo plazo mediante potenciación iterativa de la matriz de transición.

---

## 📊 Resultados y Visualizaciones

La aplicación genera:
- **Timeline de secuencias**: Visualización de estados ocultos y observaciones
- **Trellis Forward**: Tabla de probabilidades α por estado y tiempo
- **Trellis Viterbi**: Tabla de probabilidades δ con backtracking
- **Comparación estados reales vs inferidos**: Con indicadores de acierto/error
- **Matriz de confusión**: Agregada sobre múltiples simulaciones
- **Histograma de precisión**: Distribución de accuracy del Viterbi
- **Distribución estacionaria**: Teórica vs empírica
- **Conclusiones dinámicas**: Generadas automáticamente según los resultados

---

## 🛠 Tecnologías

- **HTML5** — Estructura semántica
- **CSS3** — Diseño responsivo con glassmorphism y dark theme
- **JavaScript (ES6+)** — Lógica de simulación y algoritmos
- **Canvas API** — Gráficos y visualizaciones
- **Google Fonts (Inter)** — Tipografía

No se utilizan librerías externas ni frameworks. Todo el código es vanilla.

---

## 📚 Referencias

1. Rabiner, L. R. (1989). *A Tutorial on Hidden Markov Models and Selected Applications in Speech Recognition*. Proceedings of the IEEE, 77(2), 257-286.
2. Bishop, C. M. (2006). *Pattern Recognition and Machine Learning*. Springer. Capítulo 13: Sequential Data.
3. Murphy, K. P. (2012). *Machine Learning: A Probabilistic Perspective*. MIT Press. Capítulo 17: Markov and Hidden Markov Models.
4. Jurafsky, D. & Martin, J. H. (2023). *Speech and Language Processing*. Capítulo A: Hidden Markov Models.

---

## 📝 Licencia

Proyecto académico — Universidad. Todos los derechos reservados.
