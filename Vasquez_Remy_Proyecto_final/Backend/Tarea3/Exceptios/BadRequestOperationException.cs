using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Tarea3.Exceptios
{
    public class BadRequestOperationException : Exception
    {
        public BadRequestOperationException(string message)
            : base(message)
        {

        }
    }
}
