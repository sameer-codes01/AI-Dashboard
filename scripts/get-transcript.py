
import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript(video_id):
    try:
        api = YouTubeTranscriptApi()
        
        # Try list (available method)
        try:
            # Assuming 'list' corresponds to list_transcripts
            transcript_list = api.list(video_id)
            # Find generated or manual transcript
            try:
                transcript = transcript_list.find_transcript(['en'])
            except:
                # Fallback to any available
                try:
                    transcript = transcript_list.find_manually_created_transcript(['en'])
                except:
                    try:
                        transcript = transcript_list.find_generated_transcript(['en'])
                    except:
                        # Take the first one available
                        transcript = next(iter(transcript_list))
            
            transcript_data = transcript.fetch()
            full_text = " ".join([item['text'] for item in transcript_data])
            print(json.dumps({"success": True, "transcript": full_text}))
            return

        except Exception as e_list:
             # If list fails or methods don't match standard API
             pass

        # Use fetch as fallback (available method)
        transcript = api.fetch(video_id)
        # Debug output
        # print(f"DEBUG: type={type(transcript)} content={transcript}", file=sys.stderr)
        
        # If it's a string (maybe XML?), handle it
        if isinstance(transcript, str):
             # Try to parse if it's JSON string
             try:
                 # json is already imported at top level
                 data = json.loads(transcript)
                 if isinstance(data, list):
                     transcript = data
             except:
                 pass
        
        # Try to iterate and extract text
        try:
            full_text = " ".join([item.text for item in transcript])
        except (TypeError, AttributeError):
             # Try dictionary access if attribute fails
            try:
                full_text = " ".join([item['text'] for item in transcript])
            except (TypeError, KeyError):
                # Maybe transcript is the object itself?
                if hasattr(transcript, 'text'):
                    full_text = transcript.text
                else:
                    print(json.dumps({"success": False, "error": f"Could not extract text from {type(transcript)}" + str(transcript)[:100]}))
                    return

        print(json.dumps({"success": True, "transcript": full_text}))
        
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No video ID provided"}))
        sys.exit(1)
    
    video_id = sys.argv[1]
    get_transcript(video_id)
