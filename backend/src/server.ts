import app from "./app"

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 ESG Questionnaire API ready`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
})
