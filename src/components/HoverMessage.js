// function for returning explanation box over 'music notr playing?'
export default function HoverMessage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="bg-zinc-700 p-4 rounded-md text-sm text-quaternary max-w-xs shadow-lg border-2 border-quaternary">
        <p className="mb-2">
          Having trouble playing the song? Follow these steps to ensure a smooth listening experience:
        </p>
        <ol className="mb-2 list-decimal list-inside">
          <li>Open your Spotify app on your device.</li>
          <li>Check that the selected device is set to &quot;20SEC&quot;.</li>
          <li>Press the play button within the Spotify app and wait until the song starts playing.</li>
        </ol>
        <p>
          After the song starts playing in the app, you can switch back to using &quot;20SEC&quot; solely through the browser application.
        </p>
      </div>
    </div>
  );
}
