# Simulador de Modelos Ocultos de Markov (HMM)
## Aplicación de Distribuciones de Probabilidad e Inferencia Estocástica

**Autor:** Alejandro Arango  
**Fecha:** Mayo 2026  
**Asignatura:** Módulo 2 – Actividad Didáctica 2  

---

## Enlaces del Proyecto

- 🔗 **Repositorio en GitHub:** [https://github.com/Biershoot/S25---M-dulo-2.-Actividad-did-ctica-2](https://github.com/Biershoot/S25---M-dulo-2.-Actividad-did-ctica-2)
- ▶️ **Video de Sustentación:** [https://drive.google.com/file/d/1wHlWz4uQ5LICjlKX-b_bid2SobdoiwSj/view?usp=drive_link]

---

## 1. Introducción

Los **Modelos Ocultos de Markov (HMM por sus siglas en inglés)** constituyen una extensión fundamental de las cadenas de Markov tradicionales. Mientras que en una cadena de Markov regular los estados son directamente visibles para el observador, en un HMM el sistema modelado se asume como un proceso de Markov con estados no observados (ocultos).

En un HMM, no se observa directamente en qué estado se encuentra el sistema, sino que se observa un evento (observación o emisión) que depende probabilísticamente del estado oculto actual. Esto permite modelar procesos del mundo real donde la información subyacente es incierta o ruidosa y solo podemos inferir el estado verdadero a partir de mediciones indirectas.

### 1.1 Componentes de un Modelo Oculto de Markov

Un HMM está definido matemáticamente por tres conjuntos de probabilidades fundamentales (λ = (π, A, B)):

1. **Distribución Inicial (π):** Vector que contiene la probabilidad de que el modelo comience en cada uno de los estados ocultos posibles en el tiempo t=1.
2. **Matriz de Transición (A):** Las probabilidades de cambiar de un estado oculto $i$ a otro estado oculto $j$. Satisface la propiedad de Markov (falta de memoria).
3. **Matriz de Emisión (B):** Las probabilidades de observar el evento (o medición) $k$ dado que el sistema se encuentra en el estado oculto $j$.

### 1.2 Diferencia entre Estados Ocultos y Observaciones

- **Estado Oculto:** La verdadera condición del sistema. Por ejemplo, en predicción del clima, el estado real podría ser "Soleado" o "Lluvioso".
- **Observación Visible:** La evidencia empírica que se puede medir empíricamente. En el ejemplo del clima, no sabemos el clima, pero observamos la "Humedad Baja" o "Humedad Alta" del ambiente a través de un sensor. 

### 1.3 Objetivo del Proyecto

El presente trabajo tiene como objetivo diseñar e implementar un simulador interactivo de HMM que permita:

1. Configurar y validar la Distribución Inicial, Matriz de Transición y Matriz de Emisión.
2. Ejecutar simulaciones para generar secuencias tanto de **estados ocultos** como de **observaciones**.
3. Implementar el **Algoritmo de Viterbi** para realizar inferencia estadística, es decir, descubrir la secuencia de estados ocultos más probable a partir de las observaciones generadas.
4. Evaluar la exactitud del algoritmo comparando los estados reales (ocultos) con los estados inferidos.

---

## 2. Metodología

### 2.1 Escenarios HMM Implementados

Se diseñaron cuatro problemas donde se justifica claramente la existencia de un fenómeno oculto inferible mediante mediciones visibles:

1. **Clima (Sensores):**
   - **Estados Ocultos:** Soleado, Nublado, Lluvioso (el clima real).
   - **Observaciones:** Humedad Baja, Humedad Media, Humedad Alta (lectura del sensor).
2. **Cliente E-commerce:**
   - **Estados Ocultos:** Dudoso, Interesado, Decidido (estado mental del usuario).
   - **Observaciones:** Scroll Lento, Pausa, Click Rápido (comportamiento digital medible).
3. **Estado de Salud:**
   - **Estados Ocultos:** Sano, Infección Leve, Infección Grave (estado biológico interno).
   - **Observaciones:** Temperatura Normal, Fiebre Leve, Fiebre Alta (síntomas clínicos).
4. **Mercado Bursátil:**
   - **Estados Ocultos:** Bear, Stagnant, Bull (tendencia económica real).
   - **Observaciones:** Caída Fuerte, Variación Mínima, Subida Fuerte (precio de cierre diario).

### 2.2 Simulación Estocástica

Para generar las trazas de datos, el simulador ejecuta dos pasos en cada tiempo $t$:
1. Transita al siguiente **estado oculto** basándose en la Matriz de Transición (A).
2. Genera una **observación** basándose en la Matriz de Emisión (B) y el estado oculto actual.
Se utiliza el método de transformada inversa generando un número aleatorio uniforme para muestrear índices en función de las probabilidades.

### 2.3 Algoritmo de Viterbi (Inferencia)

El algoritmo de Viterbi es un algoritmo de programación dinámica que encuentra la secuencia más probable de estados ocultos dada una secuencia de observaciones.

El algoritmo calcula la probabilidad máxima $V[t][s]$ de estar en el estado $s$ en el tiempo $t$ considerando todas las trayectorias posibles, guardando punteros (backpointers) para reconstruir el camino óptimo al final de la secuencia:

`V[t][s] = max_{prev_s} ( V[t-1][prev_s] * A[prev_s][s] * B[s][observación_t] )`

---

## 3. Resultados y Análisis

### 3.1 Secuencias Generadas e Inferencia

La aplicación permite visualizar tres líneas de tiempo (trazas) de forma interactiva:
1. **La secuencia real:** Lo que "verdaderamente" pasó en el sistema (Estados Ocultos).
2. **La secuencia observada:** La información ruidosa disponible (Observaciones).
3. **La inferencia:** Lo que el algoritmo de Viterbi logró adivinar que sucedió basado únicamente en la secuencia observada y las matrices probabilísticas.

### 3.2 Exactitud del Modelo

- Dependiendo del nivel de dispersión en la Matriz de Emisión, Viterbi logra deducir los estados ocultos reales con una exactitud variable.
- Si las matrices de emisión son deterministas o muy fuertes (ej: Sano -> 90% Temp Normal), Viterbi logra una inferencia con exactitud superior al 80%.
- Al ejecutar simulaciones repetidas (Multi-simulación de 50 o 100 repeticiones), la precisión promedio se estabiliza, confirmando la fiabilidad de la inferencia estadística del modelo para descifrar fenómenos inobservables.

### 3.3 Convergencia y Distribución Estacionaria

Al igual que en las cadenas de Markov tradicionales, los estados ocultos de un HMM convergen hacia una distribución estacionaria $\pi$ si la cadena subyacente es ergódica. Los gráficos demuestran que las frecuencias simuladas de los estados ocultos a largo plazo concuerdan con la solución teórica iterada de la matriz de transición.

---

## 4. Conclusiones

1. Los Modelos Ocultos de Markov (HMM) ofrecen un marco matemático robusto para representar sistemas reales donde existe incertidumbre sobre el verdadero estado del entorno, permitiéndonos razonar a partir de datos indirectos.
2. La clara separación estructural entre transición (dinámica del sistema subyacente) y emisión (proceso de medición o ruido) otorga a los HMM una alta flexibilidad y capacidad explicativa.
3. El algoritmo de Viterbi resulta eficiente (complejidad $O(T \cdot N^2)$) para decodificar las observaciones y es pieza clave en áreas prácticas como el reconocimiento de voz o análisis de ADN.

---

## Anexo: Ejecución del Proyecto

1. Clona el repositorio de GitHub incluido al inicio de este documento.
2. Abre el archivo `index.html` en un navegador web (ej. Google Chrome, Firefox, Edge).
3. Selecciona un escenario, ajusta los parámetros (pasos, simulaciones) y presiona "Ejecutar Simulación y Viterbi" para analizar la inferencia HMM interactiva.
