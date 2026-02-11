import {
  Search,
  SpellCheck2,
  Users,
  LineChart,
  Bot,
  Shield,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: <Search className="text-primary" size={28} />,
    bgColor: "bg-blue-100",
    title: "Plagiarism Detection",
    description: "Advanced similarity checking across millions of academic papers and web sources with detailed similarity reports.",
    points: [
      "Cross-repository comparison",
      "Real-time similarity scoring",
      "Citation analysis",
    ],
  },
  {
    icon: <SpellCheck2 className="text-primary" size={28} />,
    bgColor: "bg-green-100",
    title: "Grammar & Style Check",
    description: "Intelligent grammar checking and writing style analysis tailored for academic and research papers.",
    points: [
      "Academic writing optimization",
      "Technical terminology support",
      "Multiple language support",
    ],
  },
  {
    icon: <Users className="text-primary" size={28} />,
    bgColor: "bg-purple-100",
    title: "Reviewer Suggestions",
    description: "AI-powered reviewer matching based on expertise, publication history, and research interests.",
    points: [
      "Smart expertise matching",
      "Conflict of interest detection",
      "Availability tracking",
    ],
  },
  {
    icon: <LineChart className="text-primary" size={28} />,
    bgColor: "bg-orange-100",
    title: "Submission Analytics",
    description: "Comprehensive analytics dashboard providing insights into submission trends and review processes.",
    points: [
      "Real-time progress tracking",
      "Quality assessment metrics",
      "Performance benchmarking",
    ],
  },
  {
    icon: <Bot className="text-primary" size={28} />,
    bgColor: "bg-red-100",
    title: "AI-Powered Review",
    description: "Automated preliminary review with detailed feedback on methodology, results, and contribution.",
    points: [
      "Methodology assessment",
      "Contribution analysis",
      "Structured feedback generation",
    ],
  },
  {
    icon: <Shield className="text-primary" size={28} />,
    bgColor: "bg-indigo-100",
    title: "Secure Management",
    description: "End-to-end encrypted submission management with role-based access control and audit trails.",
    points: [
      "Military-grade encryption",
      "Compliance with data regulations",
      "Complete audit logging",
    ],
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-headline">
            Powerful AI Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our advanced AI algorithms provide comprehensive tools to enhance
            your conference management process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card p-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border"
            >
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground pt-2">
                    {feature.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                <ul className="text-muted-foreground space-y-3">
                  {feature.points.map((point, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="text-green-500 mr-3 h-5 w-5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
