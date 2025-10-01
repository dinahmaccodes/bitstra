import FormCard from "@/components/FormCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <div className="page-with-background">
      <FormCard title="Contact Us" className="max-w-lg">
        <div className="space-y-6">
          <div>
            <Label
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
              Name
            </Label>
            <Input id="name" placeholder="Your name" className="mt-1" />
          </div>

          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label
              htmlFor="subject"
              className="text-sm font-medium text-foreground"
            >
              Subject
            </Label>
            <Input
              id="subject"
              placeholder="How can we help?"
              className="mt-1"
            />
          </div>

          <div>
            <Label
              htmlFor="message"
              className="text-sm font-medium text-foreground"
            >
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us more about your inquiry..."
              className="mt-1 min-h-[120px]"
            />
          </div>

          <Button variant="success" className="w-full h-12">
            Send Message
          </Button>
        </div>
      </FormCard>
    </div>
  );
};

export default Contact;
