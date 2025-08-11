import subprocess
import sys

def install_package(package):
    """Install a Python package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✅ Successfully installed {package}")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install {package}: {e}")

def main():
    """Install required Python packages for face recognition"""
    print("Installing required Python packages for face recognition...")
    
    packages = [
        "flask",
        "face-recognition",
        "pillow",
        "psycopg2-binary",
        "bcrypt",
        "numpy"
    ]
    
    for package in packages:
        install_package(package)
    
    print("\n🎉 All packages installed successfully!")
    print("\nNext steps:")
    print("1. Set up PostgreSQL database")
    print("2. Update DATABASE_URL in api/index.py")
    print("3. Run the Flask server: python api/index.py")
    print("4. Run the Next.js frontend: npm run dev")

if __name__ == "__main__":
    main()
