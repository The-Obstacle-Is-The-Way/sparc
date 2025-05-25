"""
Module for running interactive subprocesses with output capture.
"""

import os
import re
import tempfile
import shlex
import shutil
import platform
import subprocess
from typing import List, Tuple


def run_interactive_command(cmd: List[str]) -> Tuple[bytes, int]:
    """
    Runs an interactive command with a pseudo-tty, capturing combined output.

    Assumptions and constraints:
    - We support both Linux and macOS systems 
    - `cmd` is a non-empty list where cmd[0] is the executable
    - The executable and script are assumed to be on PATH
    - If anything is amiss (e.g., command not found), we fail early and cleanly

    The output is cleaned to remove ANSI escape sequences and control characters.

    Returns:
        Tuple of (cleaned_output, return_code)
    """
    # Fail early if cmd is empty
    if not cmd:
        raise ValueError("No command provided.")
    
    # Check that the command exists
    if shutil.which(cmd[0]) is None:
        raise FileNotFoundError(f"Command '{cmd[0]}' not found in PATH.")

    # Disable pagers by setting environment variables
    env = os.environ.copy()
    env['GIT_PAGER'] = ''
    env['PAGER'] = ''
    
    # MacOS and Linux have different ways of handling this
    if platform.system() == 'Darwin':  # macOS
        # On macOS, we'll directly run the command with captured output
        # This avoids the script utility which adds control characters
        try:
            process = subprocess.run(
                cmd,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=False,  # Capture as bytes
                check=False  # Don't raise exception on non-zero exit
            )
            return_code = process.returncode
            output = process.stdout
            
            # Clean ANSI escape sequences (if any)
            output = re.sub(rb'\x1b\[[0-9;]*[a-zA-Z]', b'', output)
            
            return output, return_code
        except Exception as e:
            raise RuntimeError(f"Error running command: {e}")
    else:  # Linux
        # Create temp file for output on Linux with script command
        output_file = tempfile.NamedTemporaryFile(prefix="output_", delete=False)
        output_path = output_file.name
        output_file.close()

        def cleanup():
            if os.path.exists(output_path):
                os.remove(output_path)

        try:
            # On Linux, we can use script with -c option
            process = subprocess.run(
                ["script", "-q", "-c", ' '.join(shlex.quote(c) for c in cmd), output_path],
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            return_code = process.returncode

            # Read and clean the output
            with open(output_path, "rb") as f:
                output = f.read()
            
            # Clean ANSI escape sequences and control characters
            output = re.sub(rb'\x1b\[[0-9;]*[a-zA-Z]', b'', output)
            output = re.sub(rb'[\x00-\x08\x0b\x0c\x0e-\x1f]', b'', output)
        
        except Exception as e:
            # If something goes wrong, cleanup and re-raise
            cleanup()
            raise RuntimeError("Error running interactive capture") from e
        finally:
            # Ensure files are removed no matter what
            cleanup()

        return output, return_code
