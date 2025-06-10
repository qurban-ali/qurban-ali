
import { Card, CardContent } from '@/components/ui/card';
import { Code, Users, Lightbulb, Target } from 'lucide-react';

const About = () => {
  const highlights = [
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "Full Stack Expertise",
      description: "Proficient in both front-end and back-end development with modern technologies"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Team Leadership",
      description: "Leading development teams to deliver comprehensive web solutions"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Innovation Focused",
      description: "Committed to continuous learning and staying abreast of emerging technologies"
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Results Driven",
      description: "Focused on delivering exceptional user experiences and project success"
    }
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-12 animate-fade-in">
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                As a seasoned Team Lead and Senior Full Stack Developer with over 6 years of experience,
                I specialize in guiding development teams to deliver comprehensive web solutions.
                My leadership approach centers on fostering collaboration, promoting open communication,
                and empowering team members to excel, resulting in the successful and timely completion of complex projects.
                Led a team of 10 developers to increase application performance by 30% through architectural optimizations.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Technically, I possess a robust skill set in both front-end and back-end development.
                I have led end-to-end development initiatives using technologies such as PHP with Laravel,
                React.js, Vue.js, Node.js with Express.js, and Python. This diverse expertise enables me to architect
                scalable, high-performance applications that deliver exceptional user experiences.
                Passionate about mentoring junior developers and fostering collaborative problem-solving environments.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                I am committed to continuous learning and staying abreast of emerging technologies, ensuring
                that my teams and I are equipped to tackle evolving challenges. By blending strategic leadership
                with technical proficiency, I strive to drive innovation and contribute to the success of every
                project I undertake. Currently seeking leadership opportunities in innovative SaaS product development.
              </p>
              
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {highlights.map((highlight, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-slide-in">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {highlight.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
                      <p className="text-muted-foreground">{highlight.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
