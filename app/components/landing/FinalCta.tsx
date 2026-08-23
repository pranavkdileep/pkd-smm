import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';

export function FinalCta() {
  return (
    <section aria-label="Get started" className="bg-body pb-16 md:pb-24">
      <VStack maxWidth={1280} className="mx-auto w-full px-6">
        <VStack
          gap={4}
          align="center"
          padding={8}
          className="landing-cta-banner w-full rounded-xl text-center"
        >
          <Heading level={2}>One panel, every platform</Heading>
          <Text color="inherit" size="lg" justify="center">
            Free account, funded in minutes — your first order tracked live on your dashboard.
          </Text>
          <HStack gap={3} wrap="wrap" justify="center" className="pt-2">
            <Button
              label="Create free account"
              variant="primary"
              size="lg"
              href="/signup"
              className="bg-white text-blue-vivid shadow-lg hover:bg-white/90"
            />
            <Button
              label="Explore services"
              variant="ghost"
              size="lg"
              href="#services"
              className="border border-white/40 text-white hover:bg-white/10"
            />
          </HStack>
        </VStack>
      </VStack>
    </section>
  );
}
