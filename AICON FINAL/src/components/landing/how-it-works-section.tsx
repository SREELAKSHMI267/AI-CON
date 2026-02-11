import { Upload, Bot, Users, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <Upload className="w-10 h-10 text-primary" />,
    title: "Upload Research",
    description:
      "Submit research papers through our secure portal with automatic format validation.",
  },
  {
    icon: <Bot className="w-10 h-10 text-primary" />,
    title: "AI Analysis",
    description:
      "Our AI performs comprehensive analysis including plagiarism, grammar, and content review.",
  },
  {
    icon: <Users className="w-10 h-10 text-primary" />,
    title: "Reviewer Matching",
    description:
      "Intelligent reviewer suggestions based on expertise and research domain compatibility.",
  },
  {
    icon: <CheckCircle className="w-10 h-10 text-primary" />,
    title: "Decision Support",
    description:
      "Receive comprehensive reports and recommendations to make informed acceptance decisions.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 bg-muted/40">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-headline">
            A Simple, Four-Step Process
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From submission to decision, AICON simplifies every stage of your
            conference management workflow.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center bg-background p-8 rounded-xl shadow-lg border">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-primary/10 p-4 rounded-full">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  <span className="text-primary">{index + 1}.</span> {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
