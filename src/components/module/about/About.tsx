import {
  Sparkles,
  Globe,
  ShieldCheck,
  CalendarDays,
  BrainCircuit,
  Users,
} from "lucide-react";

function AboutContent() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="border-b border-border bg-background py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              About Lumen
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Discover events that truly{" "}
              <span className="text-primary">matter to you.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Lumen is an innovative AR-first event platform reimagining how people discover, organize, and experience real-world events through augmented reality and smart technology.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Augmented Event Discovery",
                description:
                  "Personalized event recommendations using AR overlays and AI insights, tailored for your real-world interests.",
              },
              {
                icon: CalendarDays,
                title: "Effortless AR Event Management",
                description:
                  "Create, manage, and showcase events with AR features, immersive visuals, and instant updates.",
              },
              {
                icon: Globe,
                title: "Global & Hybrid Reach",
                description:
                  "Attend, host, and discover events locally or worldwide, seamlessly blending in-person and AR-enhanced digital experiences.",
              },
              {
                icon: BrainCircuit,
                title: "Built-in AR Assistant",
                description:
                  "AI-powered AR guides answer questions, locate venues, and enrich your event journey in real time.",
              },
              {
                icon: ShieldCheck,
                title: "Trusted & Secure",
                description:
                  "Modern authentication, robust privacy controls, and state-of-the-art infrastructure keep your events and data safe.",
              },
              {
                icon: Users,
                title: "Community-Driven",
                description:
                  "Connect with organizers and attendees through shared AR visuals and interactive event engagement.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-card-foreground">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="border-y border-border bg-card/30 py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Our Mission
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Making event experiences immersive and accessible for all.
              </h2>

              <p className="mt-6 text-muted-foreground leading-7">
                We believe that technology, especially AR, should connect people and spark memories, not add barriers. Lumen blends cutting-edge augmented reality, intuitive UX, and global scalability to make every event an unforgettable experience—onsite or beyond.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-8">
              <div className="space-y-6">
                {[
                  "Augmented reality event highlights",
                  "Live AR navigation and venue discovery",
                  "Instant event updates & notifications",
                  "Cross-device compatibility",
                  "Secure booking and ticketing",
                  "Global & local community features",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3"
                  >
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />

                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-border bg-card px-6 py-16 text-center sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Join The AR Event Revolution
            </p>

            <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-5xl">
              Experience events through a new lens.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
              Lumen is pioneering the future of event discovery and participation by combining augmented reality, social connectivity, and intelligent technology—bringing people together in smarter, more memorable ways.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:scale-[1.02]">
                Explore Events
              </button>

              <button className="rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:bg-accent">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutContent;