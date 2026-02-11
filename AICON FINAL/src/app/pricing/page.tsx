
import { Check } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const tiers = [
  {
    name: 'Free',
    price: '₹0',
    frequency: '/month',
    description: 'For individuals and hobbyists starting out.',
    features: [
      'Up to 5 paper submissions',
      'Basic plagiarism detection',
      'Standard grammar & style check',
      'Email support',
    ],
    buttonText: 'Start for Free',
    buttonVariant: 'outline',
    href: '/signup'
  },
  {
    name: 'Professional',
    price: '₹1,500',
    frequency: '/month',
    description: 'For researchers and small academic groups.',
    features: [
      'Up to 50 paper submissions',
      'Advanced plagiarism detection',
      'AI-powered grammar suggestions',
      'AI Reviewer Suggestions',
      'Priority email support',
    ],
    buttonText: 'Get Started',
    buttonVariant: 'default',
    href: '/signup',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    frequency: '',
    description: 'For large conferences and institutions.',
    features: [
      'Unlimited paper submissions',
      'Full plagiarism analysis & reporting',
      'Advanced AI-powered review',
      'Submission Analytics Dashboard',
      'Dedicated account manager',
      '24/7 phone support',
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'secondary',
    href: '/#contact',
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/40">
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl font-headline">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the plan that's right for your conference or institution.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-16 lg:grid-cols-3">
              {tiers.map((tier) => (
                <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-primary shadow-2xl' : ''}`}>
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between">
                       <CardTitle className="text-2xl font-semibold">{tier.name}</CardTitle>
                       {tier.popular && <div className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">POPULAR</div>}
                    </div>
                    <CardDescription className="mt-4 text-base text-muted-foreground">{tier.description}</CardDescription>
                     <div className="mt-6">
                        <span className="text-4xl font-bold tracking-tight text-foreground">{tier.price}</span>
                        {tier.frequency && <span className="text-base font-medium text-muted-foreground">{tier.frequency}</span>}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 px-6 pb-6">
                     <ul className="space-y-4">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="p-6">
                     <Button asChild className="w-full" variant={tier.buttonVariant as any}>
                        <Link href={tier.href}>{tier.buttonText}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
