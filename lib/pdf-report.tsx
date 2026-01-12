import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

var styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748b",
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 4,
  },
  businessAddress: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 20,
  },
  scoreSection: {
    backgroundColor: "#f8fafc",
    padding: 24,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "bold",
  },
  scoreGreen: {
    color: "#22c55e",
  },
  scoreYellow: {
    color: "#eab308",
  },
  scoreRed: {
    color: "#ef4444",
  },
  scoreMessage: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
    marginTop: 20,
  },
  directoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  directoryName: {
    fontSize: 12,
    color: "#334155",
  },
  statusFound: {
    fontSize: 10,
    color: "#15803d",
    backgroundColor: "#dcfce7",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusNotFound: {
    fontSize: 10,
    color: "#b91c1c",
    backgroundColor: "#fee2e2",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#94a3b8",
  },
  recommendations: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#fffbeb",
    borderRadius: 8,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 8,
  },
  recommendationItem: {
    fontSize: 11,
    color: "#78350f",
    marginBottom: 4,
  },
  competitionSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
  },
  competitionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0369a1",
    marginBottom: 12,
  },
  competitionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  competitionLabel: {
    fontSize: 11,
    color: "#334155",
  },
  competitionValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0369a1",
  },
  competitorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e0f2fe",
  },
  competitorName: {
    fontSize: 10,
    color: "#334155",
    flex: 1,
  },
  competitorScore: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748b",
  },
})

interface DirectoryResult {
  directory: string
  status: string
  found_rating?: number
}

interface Competitor {
  name: string
  health_score: number
}

interface PDFReportProps {
  businessName: string
  businessAddress: string
  score: number
  directories: DirectoryResult[]
  competitors?: Competitor[]
  averageCompetitorScore?: number
}

export function PDFReport({ 
  businessName, 
  businessAddress, 
  score, 
  directories,
  competitors,
  averageCompetitorScore 
}: PDFReportProps) {
  function getScoreStyle() {
    if (score >= 80) return styles.scoreGreen
    if (score >= 60) return styles.scoreYellow
    return styles.scoreRed
  }

  function getScoreMessage() {
    if (score >= 80) return "Great! Your business is highly visible online."
    if (score >= 60) return "Good, but there is room for improvement."
    return "Your business needs attention to improve visibility."
  }

  var missingDirectories = directories.filter(function(d) {
    return d.status === "not_found"
  })

  var hasCompetitorData = competitors && competitors.length > 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>SeenBy</Text>
          <Text style={styles.subtitle}>Business Visibility Report</Text>
        </View>

        <Text style={styles.businessName}>{businessName}</Text>
        <Text style={styles.businessAddress}>{businessAddress}</Text>

        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>Business Health Score</Text>
          <Text style={[styles.scoreValue, getScoreStyle()]}>{score}</Text>
          <Text style={styles.scoreMessage}>{getScoreMessage()}</Text>
        </View>

        <Text style={styles.sectionTitle}>Directory Scan Results</Text>
        {directories.map(function(dir) {
          return (
            <View key={dir.directory} style={styles.directoryRow}>
              <Text style={styles.directoryName}>
                {dir.directory}
                {dir.found_rating ? " - Rating: " + dir.found_rating : ""}
              </Text>
              {dir.status === "found" ? (
                <Text style={styles.statusFound}>Found</Text>
              ) : (
                <Text style={styles.statusNotFound}>Not Found</Text>
              )}
            </View>
          )
        })}

        {missingDirectories.length > 0 && (
          <View style={styles.recommendations}>
            <Text style={styles.recommendationTitle}>Recommendations</Text>
            {missingDirectories.map(function(dir) {
              return (
                <Text key={dir.directory} style={styles.recommendationItem}>
                  - Claim your listing on {dir.directory} to improve visibility
                </Text>
              )
            })}
          </View>
        )}

        {hasCompetitorData && (
          <View style={styles.competitionSection}>
            <Text style={styles.competitionTitle}>Competition Analysis</Text>
            <View style={styles.competitionRow}>
              <Text style={styles.competitionLabel}>Your Score:</Text>
              <Text style={styles.competitionValue}>{score}</Text>
            </View>
            <View style={styles.competitionRow}>
              <Text style={styles.competitionLabel}>Competitor Average:</Text>
              <Text style={styles.competitionValue}>{averageCompetitorScore}</Text>
            </View>
            <View style={styles.competitionRow}>
              <Text style={styles.competitionLabel}>Difference:</Text>
              <Text style={styles.competitionValue}>
                {score >= (averageCompetitorScore || 0) ? "+" : ""}
                {score - (averageCompetitorScore || 0)} points
              </Text>
            </View>
            <Text style={[styles.competitionLabel, { marginTop: 12, marginBottom: 6 }]}>
              Nearby Competitors:
            </Text>
            {competitors && competitors.map(function(comp, index) {
              return (
                <View key={index} style={styles.competitorItem}>
                  <Text style={styles.competitorName}>{comp.name}</Text>
                  <Text style={styles.competitorScore}>Score: {comp.health_score}</Text>
                </View>
              )
            })}
          </View>
        )}

        <Text style={styles.footer}>
          Generated by SeenBy.io on {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  )
}