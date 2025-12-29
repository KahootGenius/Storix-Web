import socket
import json
import time

def create_cube():
    # Construct the payload for creating a cube
    # Based on the typical blender-mcp protocol for 'execute_script' or similar
    # We will try to send a Python script execution request
    
    script = """
import bpy
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 2))
obj = bpy.context.active_object
obj.name = 'MyCube'
    """
    
    # Common MCP-Blender protocol often uses a JSON structure.
    # Since we don't have the exact protocol spec, we will try a few common patterns 
    # or just raw python if it's a simple socket listener (less likely).
    # However, 'ahujasid/blender-mcp' typically expects a JSON with 'type' and 'data'.
    
    payload = {
        "type": "script",  # or "execute"
        "content": script
    }
    
    try:
        client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client.connect(('localhost', 9876))
        
        # Send data
        client.sendall(json.dumps(payload).encode('utf-8'))
        
        # Receive response (optional)
        # response = client.recv(4096)
        # print(f"Received: {response.decode('utf-8')}")
        
        print("Command sent to Blender.")
        client.close()
    except Exception as e:
        print(f"Failed to connect or send: {e}")

if __name__ == "__main__":
    create_cube()
