import { Card, CardContent } from '@/components/ui/card'
import { MotionPreset } from '@/components/ui/motion-preset'
import ProfileCarousel from '@/components/shadcn-studio/blocks/about-us-page-30/profile-carousel'
import MusicPlayerCard from '@/components/shadcn-studio/blocks/about-us-page-30/music-player-card'
import TripFolderCard from '@/components/shadcn-studio/blocks/about-us-page-30/trip-folder-card'
import SurpriseNote from '@/components/shadcn-studio/blocks/about-us-page-30/surprise-note'

const AboutUsPage = () => {
  return (
    <section className='bg-background py-8 sm:py-12 lg:py-16 w-full'>
      <div className='w-full max-w-7xl xl:max-w-[1480px] mx-auto space-y-8 px-4 sm:px-6 lg:px-8 lg:space-y-10'>
        <div className='space-y-2'>
          <MotionPreset fade blur slide={{ direction: 'down', offset: 50 }} transition={{ duration: 0.5 }}>
            <span className='text-xs uppercase tracking-[0.25em] text-[#5f5e5e] font-medium block mb-2 font-mono'>
              Atelier Heritage &bull; Est. 1924
            </span>
          </MotionPreset>
          <MotionPreset
            component='h2'
            className='text-2xl font-semibold sm:text-3xl lg:text-4xl font-serif text-foreground tracking-tight'
            fade
            blur
            delay={0.2}
            slide={{ direction: 'down', offset: 50 }}
            transition={{ duration: 0.5 }}
          >
            The Master Craftsmen Behind Our Florentine Atelier
          </MotionPreset>
        </div>

        <MotionPreset
          fade
          blur
          delay={0.4}
          slide={{ direction: 'down', offset: 50 }}
          transition={{ duration: 0.5 }}
          className='grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr] xl:grid-cols-[440px_1fr] items-stretch'
        >
          <ProfileCarousel />

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 h-full'>
            <MusicPlayerCard />

            <TripFolderCard />

            <Card className='ring-foreground/10 bg-muted/40 border border-border/80 overflow-visible rounded-3xl shadow-xs ring-1 sm:col-span-2 h-[260px] p-0 flex flex-col justify-between'>
              <CardContent className='h-full p-6'>
                <SurpriseNote />
              </CardContent>
            </Card>
          </div>
        </MotionPreset>
      </div>
    </section>
  )
}

export default AboutUsPage
