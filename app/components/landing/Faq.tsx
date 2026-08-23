'use client';

import {Collapsible, CollapsibleGroup} from '@astryxdesign/core/Collapsible';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';

import {FAQS} from './content';
import {SectionIntro} from './SectionIntro';

export function Faq() {
  return (
    <section id="faq" aria-label="Frequently asked questions" className="scroll-mt-24 bg-body py-16 md:py-24">
      <VStack maxWidth={900} gap={8} className="mx-auto w-full px-6">
        <SectionIntro
          eyebrow="FAQ"
          title="Questions about the panel itself"
          align="center"
        />

        {/* The group owns open state for valued items — first FAQ open by default. */}
        <CollapsibleGroup type="single" defaultValue="0">
          {FAQS.map((faq, index) => (
            <Collapsible
              key={faq.q}
              value={String(index)}
              trigger={
                <HStack gap={3} vAlign="center">
                  <HStack
                    width={7}
                    height={7}
                    hAlign="center"
                    vAlign="center"
                    className="shrink-0 rounded-md bg-blue-subtle text-xs font-bold text-blue-vivid"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </HStack>
                  <span className="text-sm font-semibold text-primary">{faq.q}</span>
                </HStack>
              }
            >
              <Text as="p" size="sm" color="secondary">
                {faq.a}
              </Text>
            </Collapsible>
          ))}
        </CollapsibleGroup>
      </VStack>
    </section>
  );
}
