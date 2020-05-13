import request from 'umi-request';

class SoundContext {
  audioCtx = new AudioContext();
  source: AudioBufferSourceNode | null = null;
  createNewSource = () => {
    const analyser = this.audioCtx.createAnalyser();
    const gainNode = this.audioCtx.createGain();
    const source = this.audioCtx.createBufferSource();
    source.connect(analyser);
    analyser.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    return source;
  };
  playFromBuffer = (link: string) => {
    return new Promise<AudioBuffer>((resolve, reject) =>
      request(link, { responseType: 'arrayBuffer' }).then((buffer) =>
        this.audioCtx.decodeAudioData(buffer, resolve, reject),
      ),
    ).then((buffer) => {
      this.stop();
      const source = this.createNewSource();
      source.buffer = buffer;
      source.start();
      this.source = source;
      return new Promise((resolve) => {
        source.onended = resolve;
      });
    });
  };
  stop = () => {
    if (this.source) {
      this.source.stop();
      this.source.onended = null;
    }
  };
}

export default SoundContext;
