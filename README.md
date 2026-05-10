# EnergyAI Smart Grid Platform

AI-powered household load forecasting and smart energy management platform for Indian households. EnergyAI dynamically simulates realistic electricity consumption profiles based on utility bills, predicts future load using deep learning models (LSTM + XGBoost), and provides intelligent, actionable recommendations to reduce carbon footprint and monthly expenses.

## 🌟 Features

*   **Intelligent Bill Extraction**: Upload an electricity bill to generate a completely customized, dynamically simulated household energy profile.
*   **Appliance Analytics**: Automatically populates realistic appliances (Cooling, Heating, Entertainment) based on your consumption data.
*   **Global Simulation Engine**: Modifying appliance usage instantly recalculates your entire household's predicted bill, carbon footprint, and hourly peak loads.
*   **Hourly Load Forecasting**: Visualize predicted vs. actual hourly consumption via beautiful interactive Area and Bar charts.
*   **Smart Recommendations Engine**: AI-generated insights to optimize temperature settings, upgrade aging appliances, and suggest solar viability.
*   **Historical Analysis Archive**: Securely saves past simulated reports so you can compare seasonal usage, verify efficiency, and instantly switch your dashboard back in time.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript, Vite
*   **Styling**: Tailwind CSS, Radix UI Primitives, Lucide Icons
*   **State Management**: Zustand (with localStorage persistence)
*   **Data Visualization**: Recharts
*   **Theming**: Custom Dark/Neon glassmorphism design optimized for a futuristic smart-grid aesthetic

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/energyai-smart-grid-platform.git
   cd energyai-smart-grid-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```
   The application will be running at `http://localhost:5173/`.

## 📸 Screenshots


*   

## 🔮 Future Scope

*   Integration with physical IoT Smart Plugs for real-time data streaming.
*   Backend Machine Learning integration (PyTorch/TensorFlow) to replace the localized mock simulation engine with real predictive weights.
*   Multi-tenant deployment for actual residential utility grids.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
