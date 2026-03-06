import { OpenRouter } from "@openrouter/sdk";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useCallback, useEffect, useState } from "react";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { story1, story2, story3 } from "../assets/stories";
import AsteroidDataPanel from "../components/AsteroidDataPanel";
import type { Neo, RawNeoData } from "../types";
import MobileNeoStrip from "../components/MobileNeoStrip";
import { CameraTracker } from "../components/3D/CameraTracker";
import { Subtitles } from "../components/Subtitles";
import { splitIntoSubtitles } from "../utils/textUtils";
import ErrorDialog from "../components/ErrorDialog";
import { Head } from "../components/3D/Head";

const MOCK_STORY_DELAY_MS = 1200;

const HEAD_MODELS = ['/head.glb', '/head2.glb', '/head3.glb'];

const openRouter = new OpenRouter({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
});

const generateStory = async (data: Neo) => {
  const completion = await openRouter.chat.send({
    model: "tngtech/tng-r1t-chimera:free",
    messages: [
      {
        role: "user",
        content: `You are a near-earth object. You are writing a short hallucinatory story about your experiences as you orbit the sun and interact with planets and other celestial bodies. The story should have no start or end, please base it on the following data: ${JSON.stringify(
          data
        )}, as well as the time and date: ${new Date().toLocaleString()} Do not include a title in the text`,
      },
    ],
    stream: false,
  });

  return completion;
};

const mockNeo = {
  hazardous: false,
  name: "(2014 PZ58)",
  id: "0",
  time: "04:46 ",
  size: {
    min: 53,
    max: 119,
  },
  relativeVelocity: 6,
  missDistance: 60525795,
};

export default function NeoCom() {
  const [selectedNeo, setSelectedNeo] = useState<Neo | null>(null);
  const [headModel, setHeadModel] = useState(HEAD_MODELS[0]);
  const [neoList, setNeoList] = useState<Neo[] | undefined>(undefined);
  const [subtitles, setSubtitles] = useState<string[] | undefined>(undefined);
  const [dataState, setDataState] = useState<
    "ok" | "loadingNASA" | "loadingAI" | "error"
  >("loadingNASA");

  const useRealAIStory = import.meta.env.VITE_USE_REAL_AI === "true";

  const audio = new Audio('/audio/090126.mp3');
audio.loop = true;
  audio.volume = 0.5; // optional: adjust volume


  const generateMockStory = useCallback(async () => {
    setDataState("loadingAI");
    // simulate delay and produce subtitles
    await new Promise((r) => setTimeout(r, MOCK_STORY_DELAY_MS));

    const stories = [story1, story2, story3];
    const story = stories[Math.floor(Math.random() * stories.length)];

    const parts = splitIntoSubtitles(story);
    setSubtitles(parts);


    if (!selectedNeo) {
      setSelectedNeo(mockNeo);
      setHeadModel(HEAD_MODELS[Math.floor(Math.random() * HEAD_MODELS.length)]);
    }

    setDataState("ok");
    return story;
  }, []);

  const handleCommunicate = useCallback(
    async (asteroid: Neo) => {
      setDataState("loadingAI");
      setSelectedNeo(asteroid);
      setHeadModel(HEAD_MODELS[Math.floor(Math.random() * HEAD_MODELS.length)]);

      audio.pause();
    audio.currentTime = 0;

      audio.play().catch((e) => {
        console.warn("Audio playback failed:", e);
      });

      try {
        if (useRealAIStory) {
          const content = await generateStory(asteroid);
          const msg = content?.choices?.[0]?.message?.content;
          const text = typeof msg === "string" ? msg : "";
          setSubtitles(splitIntoSubtitles(text));
          setDataState("ok");
        } else {
          await generateMockStory();
        }
      } catch (err) {
        console.error("AI generation error", err);
        setDataState("error");
      }
    },
    [generateMockStory, useRealAIStory]
  );

  useEffect(() => {
    const controller = new AbortController();

    const getData = async () => {
      setDataState("loadingNASA");

      const APIkey = import.meta.env.VITE_NASA_API_KEY;

      try {
        const currDate = new Date();
        const dateString = currDate.toISOString().split("T")[0];
        const res = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${dateString}&end_date=${dateString}&api_key=${APIkey}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        const rawNeos = data?.near_earth_objects
          ? data.near_earth_objects[Object.keys(data.near_earth_objects)[0]]
          : [];

        const currentEpoch = Date.now();

        const filteredNeos = rawNeos
          .filter(
            (neo: RawNeoData) =>
              neo.close_approach_data?.[0]?.epoch_date_close_approach <
              currentEpoch
          )
          .sort(
            (a: RawNeoData, b: RawNeoData) =>
              b.close_approach_data[0].epoch_date_close_approach -
              a.close_approach_data[0].epoch_date_close_approach
          );

        const displayNeos: Neo[] = filteredNeos.map((neo: RawNeoData) => {
          const date = new Date(
            neo.close_approach_data[0].epoch_date_close_approach
          );
          const formattedTime = `${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")} `;

          return {
            hazardous: !!neo.is_potentially_hazardous_asteroid,
            name: neo.name,
            id: neo.id,
            time: formattedTime,
            size: {
              min: Math.round(
                neo.estimated_diameter.meters.estimated_diameter_min
              ),
              max: Math.round(
                neo.estimated_diameter.meters.estimated_diameter_max
              ),
            },
            relativeVelocity: Math.round(
              Number(
                neo.close_approach_data[0].relative_velocity
                  .kilometers_per_second
              )
            ),
            missDistance: Math.round(
              Number(neo.close_approach_data[0].miss_distance.kilometers)
            ),
          } as Neo;
        });

        setNeoList(displayNeos);


        if (displayNeos.length > 0) {
          // prefer not to call handleCommunicate synchronously before state settle — directly invoke generation
          handleCommunicate(displayNeos[0]);
        } else {
          // fallback to mock flow
          await generateMockStory();
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return; // expected on unmount
        console.error("Error fetching NEOs:", err);
        setNeoList([]);
        setDataState("error");
      }
    };

    getData();

    return () => controller.abort();
  }, [handleCommunicate, generateMockStory]);


  return (
    <div className="h-screen w-screen overflow-hidden flex">
      {/* Left data panel */}
      {(dataState === "ok" || dataState === "loadingAI") && (
        <aside
          className="hidden md:block fixed top-0 left-0 h-full w-80 z-10"
          aria-label="Near-Earth Object data panel"
        >
          <AsteroidDataPanel
            selectedNeoId={selectedNeo?.id ?? undefined}
            data={neoList}
            onCommunicate={handleCommunicate}
          />
        </aside>
      )}

      {/* Mobile NEO strip - only on mobile */}
      <MobileNeoStrip
        neos={neoList}
        selectedNeoId={selectedNeo?.id ?? undefined}
        onCommunicate={handleCommunicate}
      />

      {/* Main viewport */}
      <main
        role="region"
        aria-label="3D asteroid visualization"
        style={{
          backgroundColor: "hsl(30 20% 8%)",
          width: "100%",
          height: "100%",
          cursor: "crosshair",
        }}
      >
        {dataState === "error" && (
          <ErrorDialog generateMockStory={generateMockStory} />
        )}

        <Canvas shadows camera={{ position: [0, 0, 5], fov: 90 }}>
          <color attach="background" args={["#1a1510"]} />
          <fog attach="fog" args={["#2a2520", 5, 20]} />
          <ambientLight intensity={0.2} color="#d4c5a9" />
          <directionalLight 
             position={[5, 5, 5]} 
             intensity={3} 
             color="#fff" 
             castShadow 
             shadow-mapSize={[1024, 1024]} 
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f4e4c1" />

          {dataState === "ok" && selectedNeo && (
            <group>
              <Stars
                radius={100}
                depth={50}
                count={3000}
                factor={4}
                saturation={0}
                fade
                speed={1}
              />
              {/* <Asteroid asteroid={selectedNeo} /> */}
              <Head modelUrl={headModel} />
            </group>
          )}

          <CameraTracker />

          <EffectComposer>
            <DepthOfField
              focusDistance={0}
              focalLength={0.02}
              bokehScale={3}
              height={480}
            />
            <Bloom
              luminanceThreshold={0}
              luminanceSmoothing={0.9}
              height={300}
            />
            <Noise opacity={dataState === "ok" ? 0.1 : 1} />
            <Vignette eskil={false} offset={0.2} darkness={1.6} />
          </EffectComposer>
        </Canvas>

        <Subtitles story={subtitles} dataState={dataState} />
      </main>
    </div>
  );
}
